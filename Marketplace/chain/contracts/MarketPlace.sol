// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Address.sol";

import "../Interfaces/IGameItems.sol";
import "../Interfaces/IMarketPlace.sol";

contract MarketPlace is IMarketPlace {
    using Address for address payable;

    // mapping(bytes32 => Order) public orders;
    mapping(uint256 => Order[]) public ordersOf;

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    function listItem(
        IGameItems nft,
        uint256 tokenID,
        uint256 price
    ) public override {
        require(
            nft.balanceOf(msg.sender, tokenID) > 0,
            "Owner doesn't have the NFT"
        );
        require(
            nft.isApprovedForAll(msg.sender, address(this)),
            "NFT not approved for Marketplace"
        );
        Order memory newOrder = Order({
            seller: msg.sender,
            price: price,
            tokenID: tokenID,
            index: ordersOf[tokenID].length
        });
        ordersOf[tokenID].push(newOrder);
        emit ItemListed(msg.sender, tokenID, price);
    }

    function listItemBatch(IGameItems nft, uint256 tokenID,uint256 price, uint256 number) external {//used for testing purposes
        require(nft.balanceOf(msg.sender,tokenID)>=number,
        "not enough tokens to sell");
        for(uint256 i = 0; i<number ; i++){
            listItem(nft,tokenID,price);
        }
    }

    function buyItem(
        IGameItems nft,
        uint256 tokenID,
        uint256 index
    ) external payable override {
        Order memory order = ordersOf[tokenID][index];
        require(order.seller != address(0), "Order doesn't exist");
        require(order.seller != msg.sender, "Can't buy own item");
        require(
            nft.balanceOf(order.seller, order.tokenID) != 0,
            "Seller is not owner"
        );
        require(order.price == msg.value, "Insufficient MATIC");
        payable(order.seller).transfer(msg.value);
        nft.safeTransferFrom(
            order.seller,
            msg.sender,
            order.tokenID,
            1,
            new bytes(0)
        );
        emit ItemSold(order.seller, msg.sender, order.tokenID, order.price);
        removeOrder(tokenID, index);
    }

    function removeListing(uint256 tokenID, uint256 index) external {
        removeOrder(tokenID, index);
    }

    function revokeAdmin() external {
        require(msg.sender == admin, "");
        admin = address(0);
    }

    function removeOrder(uint256 tokenID, uint256 index) internal {
        //switches the last item and the one to remove and then remove the last item in list with pop()
        if (ordersOf[tokenID].length - 1 == index) {
            ordersOf[tokenID].pop();
        } else {
            Order[] memory orderList = ordersOf[tokenID];
            Order memory _order = orderList[orderList.length - 1];
            _order.index = index;
            ordersOf[tokenID][index] = _order;
            ordersOf[tokenID].pop();
        }
    }

    function getOrdersOf(uint256 tokenID) public view returns (Order[] memory) {
        return ordersOf[tokenID];
    }
}
