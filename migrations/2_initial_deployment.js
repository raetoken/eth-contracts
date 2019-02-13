var tokenContract = artifacts.require("ROKToken");
var mintContract = artifacts.require("ROKMintContract")


module.exports = async function(deployer,networks,accounts) {
    // goal of deployment
    // Create token contract with the only minter being the minting contract, and rokfin/fserver in control of minting contract

   // deployer.deploy(tokenContract, "Rokfin Token", "ROK", 18, {from: accounts[0]}).then({

    //})
    let cap = 21000000;
    await deployer.deploy(tokenContract, "Rokfin Token", "ROK", 18, cap, {from: accounts[0]});
    var token = await tokenContract.deployed();

    await deployer.deploy(mintContract, tokenContract.address, {from:accounts[0]});
    var minter = await mintContract.deployed();
    
    await token.addMinter(mintContract.address, {from:accounts[0]});
    await token.renounceMinter({from:accounts[0]}); 
    
};