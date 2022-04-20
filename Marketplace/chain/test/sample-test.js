const { Provider } = require("@ethersproject/abstract-provider");
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
    expect(balance).to.equal(5);
  });
  it("Should be able to revoke admin",async function(){
    MPlace.revokeAdmin();
    expect(await MPlace.admin()).to.equal(ethers.constants.AddressZero);
  });
  it("Should be able to approve all items to the marketplace",async function(){
    await nft.setApprovalForAll(MPlace.address, true);
    expect(await nft.isApprovedForAll(account0.address, MPlace.address))
  })
  it("Should create market item with event",async function(){
    await expect(MPlace.listItem(nft.address,1,1000000000000))
      .to.emit(MPlace, 'ItemListed')
      .withArgs(
        account0.address,
        1,
        1000000000000,
        ethers.utils.keccak256(ethers.utils.solidityPack(["address", "uint256", "uint256"], [account0.address, 1, 1000000000000]))
      )
  })
  it("account1 should be able to buy the item", async function(){
    const orderID = ethers.utils.keccak256(
      ethers.utils.solidityPack(["address", "uint256", "uint256"],
      [account0.address, 1, 1000000000000]
      )
    );
    let balance = await waffle.provider.getBalance(account0.address)
    await expect(await MPlace.connect(account1).buyItem(nft.address,orderID, {value: 1000000000000}))
      .to.emit(MPlace, 'ItemSold')
      .withArgs(
        account0.address,
        account1.address,
        1,
        1000000000000
      )
    expect(await nft.balanceOf(account1.address,1)).to.equal(1);
    let newBalance = await waffle.provider.getBalance(account0.address)
    expect(newBalance - balance > 0)
  })
  it("Should be able to remove listing", async function(){
    await MPlace.listItem(nft.address,1,1000000000000)
    
  })
});