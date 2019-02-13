const ROKToken = artifacts.require("ROKToken");
const ROKMintContract = artifacts.require("ROKMintContract");

contract('ROKMintContract', function(accounts) {
    let creator = accounts[0];
    let tokenProps = {
        name: "RokfinToken",
        symbol: "ROK",
        decimals: 18,
        cap: 21000000
    };

    let token, minter;
    const REVERT_ERROR_MESSAGE = 'Returned error: VM Exception while processing transaction: revert';

    beforeEach(async function() {
        token = await ROKToken.new(tokenProps.name, tokenProps.symbol, tokenProps.decimals, tokenProps.cap, {from: creator});
        minter = await ROKMintContract.new(token.address, {from:creator});
        token.addMinter(minter.address, {from:creator});
        token.renounceMinter({from:creator})
    })

    describe('mint method', ()=>{

        it('minting less than 0 throws error', async ()=>{
            try{
                let status = await minter.mint(accounts[1], -1, {from:creator});
                expect.fail();
            } catch (error)
            {
                expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
            }
            
        })


        it('non owner can not mint', async ()=>{
            let randomPerson = accounts[1];
            try{
                let status = await minter.mint(randomPerson, 10, {from:randomPerson});
                expect.fail();
            } catch(error){
                expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
            }
        })

        it('mint adds correct amount of tokens to totalSupply of target contract', async ()=>{
            let rokfinCreatorAddress = accounts[3];
            let totalSupplyBefore = await token.totalSupply.call();
            let amountToMint = 10;
            await minter.mint(rokfinCreatorAddress, amountToMint, {from:creator})
            let totalSupplyAfter = await token.totalSupply.call();
            expect(totalSupplyAfter.toNumber()).to.equal(totalSupplyBefore.toNumber() + amountToMint);

        })

        it('mint adds tokens to correct address', async ()=>{
            let balanceBefore = await token.balanceOf.call(accounts[2]);
            let mintAmount = 10;
            await minter.mint(accounts[2], mintAmount, {from:creator});
            let balanceAfter = await token.balanceOf.call(accounts[2]);
            expect(balanceAfter.toNumber()).to.equal(balanceBefore.toNumber() + mintAmount);
        })

    })
    


})