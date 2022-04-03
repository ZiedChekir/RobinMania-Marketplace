// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GameAssets is ERC1155, Ownable, ERC1155Supply {
    //0x3B907c02dC6069D82D76ac07173Fc879814E73d5
    //https://testnets.opensea.io/collection/robin-mania
    string public name = "Robin Mania";
    address gameAddress;
    string uriString;
    mapping (address => uint256) public approved;
    mapping (uint256 => uint256) public Prices;
    mapping (uint256 => uint256) public maxSupplyPerAddress;
    function changeURI(string memory newURI) public {
        uriString = newURI;
    }
    constructor() ERC1155("") {
        gameAddress = msg.sender;
    }

    function changeName(string memory newName) public onlyOwner{
        name = newName;
    }

    function changeGameAddress(address newaddress) public onlyOwner{
        gameAddress = newaddress;
    }

    function ownerAddress() public view returns(address) {
        return owner();
    }

    function showMaxSupply(uint256 tokenId) public view returns(uint256){
        return maxSupplyPerAddress[tokenId];
    }

    function verifyPrice(uint256 tokenId) public view returns(uint256){
        return Prices[tokenId];
    }

    function allowToMint(address player,uint256 id) public{
        require(msg.sender == gameAddress,"you're not allowed to do this, you're not the game");
        require(balanceOf(player,id)<maxSupplyPerAddress[id],"this player reached the maximum number of mintings");
        require(balanceOf(owner(),id)>0,"no more to mint");
        require(approved[player]!=id,"already approved");
        approved[player] = id;
    }

    function setSupplyPerPlayer(uint256 id, uint256 supply) public onlyOwner{
        require(maxSupplyPerAddress[id]<supply,"you can't decrease the supply");
        maxSupplyPerAddress[id]=supply;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function setPrice(uint256 id, uint256 price) public onlyOwner{
        Prices[id]=price;
    }

    function uri(uint256 _tokenId) override public view returns (string memory){
        return string(
            abi.encodePacked(
                uriString,Strings.toString(_tokenId),".json"
            )
        );
    }

    function mint(uint256 id) public payable {
        require(approved[msg.sender]==id,"you don't have access to mint this token, you should play the game");
        require(balanceOf(msg.sender,id)<maxSupplyPerAddress[id],"you can't mint more");
        require(msg.value>=Prices[id],"not enough MATIC");
        require(balanceOf(owner(),id)>0,"no more to mint");
        _safeTransferFrom(owner(),msg.sender,id,1,"");
        approved[msg.sender]=0;
    }

    function increaseSupply(uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(owner(), id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
    function withdrawAll() external onlyOwner{
        payable(owner()).transfer(address(this).balance);
    }
}