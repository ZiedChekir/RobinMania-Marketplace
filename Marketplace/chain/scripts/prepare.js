// prepare for frontend
const _name = "RobinMania";
const URI = "https://raw.githubusercontent.com/SamiKammoun/robinmania/main/metadata/"
async function main(){
    console.log("========== deploy to a **new** localhost =====");

    /*deploy the NFT contract */
    GameItems = await ethers.getContractFactory("GameItems");
    nft = await GameItems.deploy();

    /*deploy marketplace */
    MP = await ethers.getContractFactory("MarketPlace");
    MPlace = await MP.deploy();

    console.log("nftContractAddress:",nft.address);
    console.log("marketplaceAddress:",MPlace.address);

    [owner, account1,account2] = await ethers.getSigners();
    const address0 = await owner.getAddress()
    const address1 = await account1.getAddress()
    console.log("set nft URI");
    await nft.changeURI(URI);
    console.log(await nft.uri(1));
    console.log("1.mint tokens 1-5 to account 0 with quantity of 10");
    for(let i=1;i<6;i++){
        await nft.increaseSupply(i,10,[]);
    }

    console.log("2.list tokens 1-5 to market with value 1000000000000");
    await nft.setApprovalForAll(MPlace.address, true);
    for(let i=1; i<6;i++){
        await MPlace.listItem(nft.address,i,"1000000000000000000");
    }

    console.log("3.mint tokens 1-5 to account 1 with quantity of 5");
    for(let i=1;i<6;i++){
        await nft.increaseSupply(i,5,[]);
        await nft.safeTransferFrom(
            address0,
            address1,
            i,
            5,
            []
        )
    }

    console.log("4.list tokens 1-5 to market with value 555555555555");
    await nft.connect(account1).setApprovalForAll(MPlace.address, true);
    for(let i=1; i<6;i++){
        await MPlace.connect(account1).listItem(nft.address,i,"5000000000000000000");
    }

    console.log("5.account1 buys item 1 from account0");
    await MPlace.connect(account1).buyItem(nft.address,1,0, {value: "1000000000000000000"})
}
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })