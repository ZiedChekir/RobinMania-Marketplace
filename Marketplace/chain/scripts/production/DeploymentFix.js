async function main() {
  const totalSupply = ethers.BigNumber.from("1000");
  const supplyPerPlayer = ethers.BigNumber.from("30");

  GameItems = await ethers.getContractFactory("GameItems");
  nft = await GameItems.attach("0x98aEc84C0450976031B17a6D5F49d976393e9535");

  MP = await ethers.getContractFactory("MarketPlace");
  MPlace = await MP.attach("0xb53E8815E9d691354E0f20a9a7899F07785b24a6");
  Auction = await ethers.getContractFactory("NftAuction");
  auction = await Auction.attach("0xfF2A4e7E53732E06b67BdDa02414F6d119228C20");

  console.log("nftContractAddress:", nft.address);
  console.log("marketplaceAddress:", MPlace.address);
  console.log("auction address : ", auction.address);
  console.log("1.mint tokens 4-5 to account 0 with quantity of 1000 and list items for sale");

  for (let i = 4; i < 6; i++) {
    if (i != 4) {
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
