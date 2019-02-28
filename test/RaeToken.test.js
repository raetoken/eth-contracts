const RaeToken = artifacts.require("RaeToken");
const ROKMinter = artifacts.require("RaeMintContract");

contract('RaeToken', function(accounts) {
    let creator = accounts[0];
    let tokenProps = {
        name: "RokfinToken",
        symbol: "RAE",
        decimals: 18,
        cap: 21000000
    };

    let token, minter;
    const REVERT_ERROR_MESSAGE = 'Returned error: VM Exception while processing transaction: revert';

    beforeEach(async function() {
        token = await RaeToken.new(tokenProps.name, tokenProps.symbol, tokenProps.decimals, tokenProps.cap, {from: creator});
    })
    
    it('total supply of tokens initialized to 0', async () => {
        let totalSupply = await token.totalSupply.call();
        expect(totalSupply.toNumber()).to.equal(0);
    })

    it('creator can assign new minter', async () =>{
        await token.addMinter(accounts[2], {from: creator});
    })

    it('creator can pause token contract', async () => {
        await token.pause({from:creator});
    })

    it('creator can unpuase contract', async () => {
        await token.pause({from:creator});
        await token.unpause({from:creator});
    })

    it('no transfers when token paused', async () => {
        let person = accounts[3];
        await token.pause({from: creator});
        await token.mint(accounts[2], 100, {from:creator});
        try
        {
            await token.transfer(accounts[3], 10, {from:accounts[2]});
            expect.fail();
        } catch (error)
        {
            expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
        }
    });



})