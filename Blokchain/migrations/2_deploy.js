const GameItems = artifacts.require('GameItems.sol');

module.exports = function (deployer){
    deployer.deploy(GameItems);
}