const GameItems = artifacts.require("GameItems.sol");


contract("GameItems", accounts => {
  it("Increasing Supply", async () => {
    let instance = await GameItems.deployed();
    for(let i=1;i<6;i++){
      await instance.increaseSupply(i,500,'0x');
      let balance = await instance.balanceOf(accounts[0],i);
      balance = balance.toNumber();
      assert(balance==500, "couldn't add supply");
    }
    
  });
  it("Setting max supply per address", async () => {
    let instance = await GameItems.deployed();
    let supplyPerPlayer = [1,2,2,2,4];//1 key, 2 bows, health-potion and staff, and 4 swords at max per player
    for(let i=1;i<6;i++){
        await instance.setSupplyPerPlayer(i,supplyPerPlayer[i-1]);
        let supply = await instance.showMaxSupply(i);
        supply = supply.toNumber();
        assert(supply==supplyPerPlayer[i-1], "couldn't add max supply per player");
    }
  });
  it("Setting price", async () => {
    let instance = await GameItems.deployed();
    let prices = ["500000000000000000","300000000000000000","300000000000000000","300000000000000000","100000000000000000"];//1 key, 2 bows, health-potion and staff, and 4 swords at max per player
    for(let i=1;i<6;i++){
        await instance.setPrice(i,prices[i-1]);
        let expected = web3.utils.toBN(prices[i-1]);
        let price = await instance.verifyPrice(i);
        assert.deepEqual(price,expected, "couldn't set the price");
    }
  });

});