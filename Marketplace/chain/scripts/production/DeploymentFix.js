async function main() {
  const totalSupply = ethers.BigNumber.from("1000");
  const supplyPerPlayer = ethers.BigNumber.from("30");

  GameItems = await ethers.getContractFactory("GameItems");
  nft = await GameItems.attach("0x8d21a0AE7ECcD554b4B08fd302e0D67bA4D6E3f5");

  MP = await ethers.getContractFactory("MarketPlace");
  MPlace = await MP.attach("0x718ba26c0C7822CCC10fa51D1937FC1edd7A89cb");
  Auction = await ethers.getContractFactory("NftAuction");
  auction = await Auction.attach("0x429ACFdF3a30acef8E5774B1497130803E784819");

  console.log("nftContractAddress:", nft.address);
  console.log("marketplaceAddress:", MPlace.address);
  console.log("auction address : ", auction.address);
  console.log("1.mint tokens 4-5 to account 0 with quantity of 1000 and list items for sale");

  for (let i = 5; i < 6; i++) {
    if (i != 5) {
      await nft.increaseSupply(i, totalSupply, []);
      await nft.setSupplyPerPlayer(i, supplyPerPlayer);
    }

    console.log("listing token" + i);
    await MPlace.listItemBatch(nft.address, i, "1000000000000000", 10, {
      gasLimit: 9367155,
    });
    await auction.createNewAuctionItem(nft.address, i, "100000000", 604800, "1000", {
      gasLimit: 248982,
    });
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
