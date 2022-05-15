async function main() {

    const Auction = await ethers.getContractFactory("NftAuction");
    const auction = await Auction.deploy();
    await auction.deployed();

    GameItems = await ethers.getContractFactory("GameItems");
    nft = await GameItems.deploy();

  
    console.log("nftContractAddress: ",nft.address);
    console.log("auction : ",auction.address);
  
    [owner, account1,account2] = await ethers.getSigners();
    const address0 = await owner.getAddress()
    const address1 = await account1.getAddress()
    const address2 = await account2.getAddress();
    console.log("1.mint tokens 1-5 to account 0 with quantity of 10");
    for(let i=1;i<6;i++){
        await nft.increaseSupply(i,10,[]);
    }


    
    console.log("create auction for each item with account0 ")
    await nft.setApprovalForAll(auction.address, true);
    for(let i=1; i<6;i++){
        
        await auction.createNewAuctionItem(nft.address,i,"100000000",10*60,"1000");
    }


    console.log("balance of owner " + await  owner.getBalance());
    console.log("balance of user 1 "+ await  account1.getBalance());

    console.log("balance of user 2 "+ await account2.getBalance());

    console.log("user 1 place a bid on Auction ")
    await auction.connect(account1).placeBid(1,0,{value: "9990000000000000000"});
    console.log("user 2 place a bid on Auction ")

    await auction.connect(account2).placeBid(1,0,{value: "99999998797299492708"});
    

    console.log(await auction.getAuction(1,0)); 
    console.log("checking withdrawal of auction")
    setTimeout(async function() {
        await auction.connect(owner).AuctionEnd(nft.address,1,0)
        const balanceofowner = await nft.connect(owner).balanceOf(address0,1);
        const balanceofuser = await nft.connect(account2).balanceOf(address2,1);
        console.log("the balance of user 2 of tokenId 1 is: "+ balanceofuser);
        console.log("the balance of owner  of tokenId 1 is: "+ balanceofowner);


        console.log("balance of owner " +await  owner.getBalance()); // should increase
        console.log("balance of user 1 "+ await account1.getBalance());// should be constant because the bid is reverted

        console.log("balance of user 2 "+ await account2.getBalance()); // should decrease 

    }, 10000);

}




main()
  