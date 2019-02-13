const ROKToken = artifacts.require("ROKToken");
const ROKMinter = artifacts.require("ROKMintContract");

contract('ROKToken', function(accounts) {
    let creator = accounts[0];
    const REVERT_ERROR_MESSAGE = 'Returned error: VM Exception while processing transaction: revert';

    beforeEach(async function() {
    })
    
    it('total supply of tokens initialized to 0', async () => {
        let token = await ROKToken.deployed();
        let totalSupply = await token.totalSupply.call();
        expect(totalSupply.toNumber()).to.equal(0);
    })

    it('creator cant call mint directly', async () =>{
        try {
            let token = await ROKToken.deployed();
            let status = await token.mint(accounts[1], 10, {from: accounts[0]});
            expect.fail();
        } catch (error) {
            expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
        }
    })



})