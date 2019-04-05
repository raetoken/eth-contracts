const RaeToken = artifacts.require("RaeToken");
const ROKMinter = artifacts.require("RaeMintContract");
const BN = web3.utils.BN;

contract('RaeToken', function(accounts) {
    let creator = accounts[0];
    let tokenProps = {
        name: "RokfinToken",
        symbol: "RAE",
        decimals: 18,
        cap: "34000000000000000000000000"
    };

    let initialSupply = '84000000000000000000000' // 84,000 RAE

    let token, minter;
    const REVERT_ERROR_MESSAGE = 'Returned error: VM Exception while processing transaction: revert';

    beforeEach(async function() {
        token = await RaeToken.new(tokenProps.name, tokenProps.symbol, tokenProps.decimals, tokenProps.cap, {from: creator});
    })
    
    it('total supply of tokens initialized to 84,000 RAE', async () => {
        let totalSupply = await token.totalSupply.call();
        expect(totalSupply.toString()).to.equal(initialSupply);
    })

    it('84,000 initial RAE go to creator of token contract', async () => {
        let creatorBalance = await token.balanceOf.call(creator);
        expect(creatorBalance.toString()).to.equal(initialSupply);
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
        try
        {
            await token.transfer(accounts[3], 10, {from:accounts[2]});
            expect.fail();
        } catch (error)
        {
            expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
        }
    });

    it('no mints at all', async () => {
        try
        {
            await token.mint(accounts[2], 100, {from:creator});
            expect.fail();
        } catch (error)
        {
            expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
        }
    });

    it('no bulkMints when token paused', async () => {
        let person = accounts[3];
        await token.pause({from: creator});
        try
        {
            await token.mintBulk([accounts[0]], [new BN('10000000000')]);
            expect.fail();
        } catch (error)
        {
            expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
        }
    });

    it('no burns when token paused', async () => {
        let person = accounts[3];
        await token.pause({from: creator});
        try
        {
            await token.burn(10, {from:accounts[3]});
            expect.fail();
        } catch (error)
        {
            expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
        }
    });


    



})