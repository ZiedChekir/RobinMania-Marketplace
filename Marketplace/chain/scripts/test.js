async function main() {

    const Auction = await ethers.getContractFactory("NftAuction");
    const auction = await Auction.deploy();
    await auction.deployed();

    GameItems = await ethers.getContractFactory("GameItems");
    nft = await GameItems.deploy();


       console.log("auction : ",auction.address);
  
    [owner, account1,account2] = await ethers.getSigners();
    const address0 = await owner.getAddress()
    const address1 = await account1.getAddress()
    const address2 = await account2.getAddress();
   


    
   
    for(let i=1; i<6;i++){
        
        await auction.createNewAuctionItem(nft.address,i,"100000000",10,"1000");
    }


}




main()
  