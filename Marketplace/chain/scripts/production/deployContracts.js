


async function main(){
    console.log("========== deploy to Testnet =====");
    const totalSupply = ethers.BigNumber.from("1000")
    const supplyPerPlayer = ethers.BigNumber.from("30")
    /*deploy the NFT contract */
    GameItems = await ethers.getContractFactory("GameItems");
    nft = await GameItems.deploy();

    /*deploy marketplace */
    MP = await ethers.getContractFactory("MarketPlace");
    MPlace = await MP.deploy();
    const Auction = await ethers.getContractFactory("NftAuction");
    const auction = await Auction.deploy();


    console.log("nftContractAddress:",nft.address);
    console.log("marketplaceAddress:",MPlace.address);
    console.log("auction address : ",auction.address);
    console.log("1.mint tokens 1-5 to account 0 with quantity of 10");
    for(let i=1;i<6;i++){
        let j = ethers.BigNumber.from(i)
        await nft.increaseSupply(j,totalSupply,[]);
        await nft.setSupplyPerPlayer(j,supplyPerPlayer);
    }
}
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })