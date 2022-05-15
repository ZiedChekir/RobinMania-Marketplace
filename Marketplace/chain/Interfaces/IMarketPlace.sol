// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./IGameItems.sol";

interface IMarketPlace{
    event ItemListed(
        address indexed ownerOfNFTs,
        uint256 indexed tokenID,
        uint256 price
    );
    event ItemSold(
        address indexed from,
        address indexed to,
        uint256 indexed tokenID,
        uint256 price
    );
    event OrderRemoved(
        address indexed seller,
        uint256 indexed tokenID,
        bytes32 orderID
    );
    struct Order {
        address seller;
        uint256 price;
        uint256 tokenID;
        uint256 index;
    }
    function listItem(
        IGameItems nft,
        uint256 tokenID,
        uint256 price
    ) external;
    function buyItem(
        IGameItems nft,
        uint256 tokenID,
        uint256 index
    ) external payable;
    
   
}


