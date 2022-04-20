const { expect } = require("chai");

describe("NFT Marketplace ", function () {
  before(async function(){//deploys contracts before running tests
    [account0,account1,account2] = await ethers.getSigners();
    MP = await ethers.getContractFactory("MarketPlace");
    MPlace = await MP.deploy();
    GameItems = await ethers.getContractFactory("GameItems");
    nft = await GameItems.deploy();
  })
  it("admin should be contract owner", async function () {
    const adminAddress = await MPlace.admin();
    expect(adminAddress).to.equal(account0.address);
  });
  it("should mint NFTs to account0",async function(){//minting should only be done in the game and it happens differently, this is only for testing
    await nft.increaseSupply(1,5,[]);
    const balance = await nft.balanceOf(account0.address,1);
    console.log(balance);
    expect(balance).to.equal(5);
  });
  it("Should be able to revoke admin",async function(){
    MPlace.revokeAdmin();
    expect(await MPlace.admin()).to.equal(ethers.constants.AddressZero);
  });
  
});