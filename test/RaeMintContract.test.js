const RaeToken = artifacts.require("RaeToken");
const RaeMintContract = artifacts.require("RaeMintContract");

contract('RaeMintContract', function(accounts) {
    let creator = accounts[0];
    let tokenProps = {
        name: "RokfinToken",
        symbol: "ROK",
        decimals: 18,
        cap: 210000000
    };

    let token, minter;
    const REVERT_ERROR_MESSAGE = 'Returned error: VM Exception while processing transaction: revert';

    beforeEach(async function() {
        token = await RaeToken.new(tokenProps.name, tokenProps.symbol, tokenProps.decimals, tokenProps.cap, {from: creator});
        minter = await RaeMintContract.new(token.address, {from:creator});
        token.addMinter(minter.address, {from:creator});
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

    describe('bulkMintAggregator mints 28% to aggregator and 72% to creator', () => {
        let aggregator = accounts[8];
        let addresses = [accounts[0], accounts[1], accounts[2]]
        let creatorPercent = 72;
        let aggPercent = 100 - creatorPercent;
        let values = [2000, 20000, 200000];

        // beforeEach(async function() {
        //     token = await RaeToken.new(tokenProps.name, tokenProps.symbol, tokenProps.decimals, tokenProps.cap, {from: creator});
        //     minter = await RaeMintContract.new(token.address, {from:creator});
        //     token.addMinter(minter.address, {from:creator});
        // })

        it('mints 28% to aggregator and 72% to creator', async () => {
            let balancesBefore = [];
            let balancesAfterExpected = [];
            
            addresses.forEach(async (addr, idx) => {
                var balance = await token.balanceOf.call(addr);
                balancesBefore.push(balance.toNumber());
                balancesAfterExpected.push(balance.toNumber() + creatorPercent * values[idx] / 100);
            })

            let aggBalanceBefore = await token.balanceOf.call(aggregator);

            await minter.bulkMintAggregator(addresses, values, aggregator);
            
            addresses.forEach(async (addr, idx) => {
                var balanceAfter = await token.balanceOf.call(addr);
                expect(balanceAfter.toNumber()).to.equal(balancesAfterExpected[idx]);
            });

            let aggBalanceAfter = await token.balanceOf.call(aggregator);

            expect(aggBalanceAfter.toNumber()).to.equal(aggBalanceBefore.toNumber() + (values[0] + values[1] + values[2]) * aggPercent / 100);
            
            
        })

        it('reverts if overflow', async () => {

        })

        it('reverts if addresses.length > values.length', async () => {

        })

        it('reverts if addresses.length < values.length', async () => {

        })

        it('reverts if addresses.length empty', async () => {

        })



    })

    describe('transfer to new mint contract', () => {
        it('addMinter gives new contract minting role', async () => {
            minterV2 = await RaeMintContract.new(token.address, {from:creator});
            await minter.addMinter(minterV2.address);
            let balanceBefore = await token.balanceOf.call(accounts[2]);
            let mintAmount = 10;
            await minterV2.mint(accounts[2], mintAmount, {from:creator});
            let balanceAfter = await token.balanceOf.call(accounts[2]);
            expect(balanceAfter.toNumber()).to.equal(balanceBefore.toNumber() + mintAmount);
        })

        it('after revoke, mint contract can not mint', async () => {
            await minter.renounceMintingRole();
            try {
                await minter.mint(accounts[2], 10, {from:creator});
                expect.fail();
            } catch (error) {
                expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
            }
        })
    })
    


})