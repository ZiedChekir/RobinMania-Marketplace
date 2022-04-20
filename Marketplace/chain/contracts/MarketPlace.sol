// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Address.sol";

import "../Interfaces/IGameItems.sol";
import "../Interfaces/IMarketPlace.sol";

contract MarketPlace is IMarketPlace {
  using Address for address payable;
  
  mapping(bytes32 => Order) public orders;

  address public admin;

  constructor() {
    admin = msg.sender;
  }

  function listItem(
    IGameItems nft,
    uint256 tokenID,
    uint256 price
  ) external override {
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
      price : price,
      tokenID : tokenID
    });
    bytes32 orderID = keccak256(abi.encodePacked(newOrder.seller,newOrder.tokenID,newOrder.price));
    orders[orderID] = newOrder;
    emit ItemListed(msg.sender,tokenID,price,orderID);
  }
  function buyItem(IGameItems nft,bytes32 orderID)
    external
    payable
    override
  {
    Order memory order = orders[orderID];
    require(
      order.seller != address(0),
      "Order doesn't exist"
    );
    require(
      order.seller != msg.sender,
      "Can't buy own item"
    );
    require(
      nft.balanceOf(order.seller, order.tokenID) != 0,
      "Seller is not owner"
    );
    require(order.price == msg.value, "Insufficient KAI");
    payable(order.seller).transfer(msg.value);
    nft.safeTransferFrom(order.seller, msg.sender, order.tokenID, 1, new bytes(0));
    emit ItemSold(order.seller,msg.sender,order.tokenID,order.price);
    delete orders[orderID];
  }

  function removeListing(bytes32 orderID) external {
    require(msg.sender == orders[orderID].seller,"You didn't list this NFT");
    emit OrderRemoved(orders[orderID].seller,orders[orderID].tokenID,orderID);
    delete orders[orderID];
  }

  function revokeAdmin() external {
        require(msg.sender == admin, "");
        admin = address(0);
    }

}