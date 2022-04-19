// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./IGameItems.sol";

interface IMarketPlace{
    event ItemsListed(
        address indexed ownerOfNFTs,
        uint256 indexed tokenID,
        uint256 amount,
        uint256 price
    );
    event ItemSold(
        address indexed from,
        address indexed to,
        uint256 indexed tokenID,
        uint256 price
    );
    event ItemsRemoved(
        address indexed ownerOfNFT,
        uint256 indexed tokenID,
        uint256 amount
    );
    struct Order {
        address seller;
        uint256 price;
        uint256 amount;
        uint256 tokenID;
    }
    function listItem(
        IGameItems nft,
        uint256 tokenID,
        uint256 price,
        uint256 amount
    ) external;
    function buyItem(
        IGameItems nft,
        Order memory order
    ) external payable;
    function withdraw() external;
}