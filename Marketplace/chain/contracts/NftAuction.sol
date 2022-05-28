pragma solidity ^0.8.12;

import "../Interfaces/IGameItems.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract NftAuction is ERC1155Holder {
    mapping(uint256 => Auction[]) public AuctionOf;
    mapping(uint256 => mapping(uint256 => Bid[])) public BidsOf; //BidsOf[_tokenId][AuctionIndex]
    address public admin;

    //for reentrancy attacks
    bool internal locked;

    modifier reentrancyLock() {
        require(!locked, "the contract vault is locked");
        locked = true;
        _;
        locked = false;
    }

    constructor() {
        admin = msg.sender;
        locked = false;
    }

    enum AuctionState {
        OPEN,
        ENDED,
        CANCELLED
    }
    struct Bid {
        address bidder;
        uint256 ammount;
        uint256 bidTime;
    }
    struct Auction {
        uint256 minBidIncrement;
        uint256 auctionStartedAt;
        //uint32 auctionBidPeriod;
        uint256 auctionEnd; // we can extend bidding time when a user has made a bid and we only change this value
        uint256 startPrice;
        uint256 highestBid;
        address highestBidder;
        address seller;
        AuctionState state;
        uint256 index;
        uint256 numberOfBids;
    }

    event NftAuctionCreated(
        uint256 tokenId,
        address nftSeller,
        uint256 minPrice,
        uint256 auctionBidPeriod,
        uint256 bidIncreasePercentage
    );
    event BidMade(uint256 tokenID, address bidder, uint256 ammount);
    event AuctionEnded(uint256 tokenId, uint256 index);

    modifier priceGreaterThanZero(uint256 x) {
        require(x > 0, "price have to be greater than zero");
        _;
    }

    function createNewAuctionItem(
        IGameItems nft,
        uint256 _tokenId,
        uint256 _startPrice,
        uint32 _auctionBidPeriod,
        uint256 _minBidIncrement
    ) external priceGreaterThanZero(_startPrice) {
        require(
            nft.balanceOf(msg.sender, _tokenId) > 0,
            " you need to own this NFT to auction it "
        );
        require(
            nft.isApprovedForAll(msg.sender, address(this)),
            "NFT not approved for Auction"
        );

        Auction memory newAuction = Auction({
            minBidIncrement: _minBidIncrement,
            auctionStartedAt: block.timestamp,
            auctionEnd: block.timestamp + _auctionBidPeriod,
            startPrice: _startPrice,
            seller: msg.sender,
            highestBid: _startPrice,
            highestBidder: msg.sender,
            state: AuctionState.OPEN,
            index: AuctionOf[_tokenId].length,
            numberOfBids: 0
        });
        nft.safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId,
            1,
            new bytes(0)
        );
        AuctionOf[_tokenId].push(newAuction);
        emit NftAuctionCreated(
            _tokenId,
            msg.sender,
            _startPrice,
            _auctionBidPeriod,
            _minBidIncrement
        );
    }

    function placeBid(uint256 _tokenId, uint256 index)
        public
        payable
        priceGreaterThanZero(msg.value)
        reentrancyLock
    {
        require(
            AuctionOf[_tokenId][index].highestBid +
                AuctionOf[_tokenId][index].minBidIncrement <=
                msg.value,
            "bid price is less than the minimum required bid increment"
        );
        require(AuctionOf[_tokenId][index].state == AuctionState.OPEN);
        require(
            AuctionOf[_tokenId][index].seller != msg.sender,
            "cant bid on own auction"
        );
        Auction memory auction = AuctionOf[_tokenId][index];
        //Get data of previous bidder
        address prevHighestBidder = auction.highestBidder;
        uint256 prevHighestBid = auction.highestBid;
        // refund the previous bid to the previous highest bidder
        if (auction.highestBidder != auction.seller) {
            payable(prevHighestBidder).transfer(prevHighestBid);
        }
        //update the new highest bidder
        AuctionOf[_tokenId][index].highestBidder = msg.sender;
        AuctionOf[_tokenId][index].highestBid = msg.value;

        emit BidMade(_tokenId, msg.sender, msg.value);
    }

    function AuctionEnd(
        IGameItems nft,
        uint256 _tokenId,
        uint256 index
    ) external payable reentrancyLock {
        require(
            msg.sender == AuctionOf[_tokenId][index].seller ||
                msg.sender == AuctionOf[_tokenId][index].highestBidder,
            "you need to be the owner or the highest bidder"
        );
        require(
            getAuctionState(_tokenId, index) == AuctionState.ENDED,
            "the auction is still open"
        );
        require(AuctionOf[_tokenId][index].state == AuctionState.OPEN); //it means this is the first time the auction is claimed
        require(nft.balanceOf(address(this), _tokenId) > 0, "Errorrrita");

        nft.safeTransferFrom(
            address(this),
            AuctionOf[_tokenId][index].highestBidder,
            _tokenId,
            1,
            new bytes(0)
        );
        payable(AuctionOf[_tokenId][index].seller).transfer(
            AuctionOf[_tokenId][index].highestBid
        );
        AuctionOf[_tokenId][index].state = AuctionState.ENDED;
        emit AuctionEnded(_tokenId, index);
    }

    //cancel auction not implemented yet
    function getAuctionState(uint256 _tokenId, uint256 index)
        public
        view
        returns (AuctionState)
    {
        if (block.timestamp > AuctionOf[_tokenId][index].auctionEnd)
            return AuctionState.ENDED;
        else return AuctionState.OPEN;
    }

    function getAuction(uint256 _tokenId, uint256 index)
        public
        view
        returns (Auction memory)
    {
        return AuctionOf[_tokenId][index];
    }

    function getAuctionOf(uint256 _tokenId)
        public
        view
        returns (Auction[] memory)
    {
        return AuctionOf[_tokenId];
    }
}
