async function main() {
  const URI =
    "https://raw.githubusercontent.com/SamiKammoun/robinmania/main/metadata/";
  console.log("========== deploy to Testnet =====");
  const totalSupply = ethers.BigNumber.from("1000");
  const supplyPerPlayer = ethers.BigNumber.from("30");
  /*deploy the NFT contract */
  GameItems = await ethers.getContractFactory("GameItems");
  nft = await GameItems.deploy();
  console.log("------setting URI---------");
  await nft.changeURI(URI);
  /*deploy marketplace */
  MP = await ethers.getContractFactory("MarketPlace");
  MPlace = await MP.deploy();
  Auction = await ethers.getContractFactory("NftAuction");
  auction = await Auction.deploy();

  console.log("nftContractAddress:", nft.address);
  console.log("marketplaceAddress:", MPlace.address);
  console.log("auction address : ", auction.address);
  console.log(
    "1.mint tokens 1-5 to account 0 with quantity of 1000 and list items for sale"
  );
  await nft.setApprovalForAll(auction.address, true);
  await nft.setApprovalForAll(MPlace.address, true);
  for (let i = 1; i < 6; i++) {
    await nft.increaseSupply(i, totalSupply, []);
    await nft.setSupplyPerPlayer(i, supplyPerPlayer);
    console.log("listing token" + i);
    await MPlace.listItemBatch(nft.address, i, "1000000000000000", 100, {
      gasLimit: 9367155,
    });
    await auction.createNewAuctionItem(
      nft.address,
      i,
      "100000000",
      604800,
      "1000",
      {
        gasLimit: 248982,
      }
    );
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
