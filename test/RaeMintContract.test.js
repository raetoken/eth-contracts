const RaeToken = artifacts.require("RaeToken");
const RaeMintContract = artifacts.require("RaeMintContract");
const BN = web3.utils.BN;

contract('RaeMintContract', function(accounts) {
    let creator = accounts[0];
    let tokenProps = {
        name: "Rokfin Token",
        symbol: "RAE",
        decimals: 18,
        cap: '34000000000000000000000000'
    };
    let token, minter;
    const REVERT_ERROR_MESSAGE = 'Returned error: VM Exception while processing transaction: revert';
    
    beforeEach(async function() {
        token = await RaeToken.new(tokenProps.name, tokenProps.symbol, tokenProps.decimals, tokenProps.cap, {from: creator});
        minter = await RaeMintContract.new(token.address, {from:creator});
        await token.addMinter(minter.address, {from:creator});
    })

    // describe('mint method', ()=>{
        
    //     it('minting less than 0 throws error', async ()=>{
    //         try{
    //             let status = await minter.mint(accounts[1], -1, {from:creator});
    //             expect.fail();
    //         } catch (error)

    //         {
    //             expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
    //         }
            
    //     })


    //     it('non owner can not mint', async ()=>{
    //         let randomPerson = accounts[1];
    //         try{
    //             let status = await minter.mint(randomPerson, 10, {from:randomPerson});
    //             expect.fail();
    //         } catch(error){
    //             expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
    //         }
    //     })

    //     it('mint adds correct amount of tokens to totalSupply of target contract', async ()=>{
    //         let rokfinCreatorAddress = accounts[3];
    //         let totalSupplyBefore = await token.totalSupply.call();
    //         let amountToMint = 10;
    //         await minter.mint(rokfinCreatorAddress, amountToMint, {from:creator})
    //         let totalSupplyAfter = await token.totalSupply.call();
    //         expect(totalSupplyAfter.toNumber()).to.equal(totalSupplyBefore.toNumber() + amountToMint);

    //     })

    //     it('mint adds tokens to correct address', async ()=>{
    //         let balanceBefore = await token.balanceOf.call(accounts[2]);
    //         let mintAmount = 10;
    //         await minter.mint(accounts[2], mintAmount, {from:creator});
    //         let balanceAfter = await token.balanceOf.call(accounts[2]);
    //         expect(balanceAfter.toNumber()).to.equal(balanceBefore.toNumber() + mintAmount);
    //     })

    // })

    describe('bulkMintAggregator', () => {
        let aggregators = [accounts[7], accounts[7], accounts[9],accounts[7], accounts[7], accounts[9]];
        let addresses = [accounts[0], accounts[1], accounts[2],accounts[0], accounts[1], accounts[2]];
        let creatorPercent = new BN(72);
        let aggPercent = new BN(100 - creatorPercent);
        let values = [new BN('1000000000000000000000'),new BN('1000000000000000000000'), new BN('2000000000000000000000'),new BN('2000000000000000000000'),new BN('2000000000000000000000'), new BN('2000000000000000000000')];

        beforeEach(async function() {
            token = await RaeToken.new(tokenProps.name, tokenProps.symbol, tokenProps.decimals, tokenProps.cap, {from: creator});
            minter = await RaeMintContract.new(token.address, {from:creator});
            token.addMinter(minter.address, {from:creator});
        })

        it('mints 28% to aggregator and 72% to creator', async () => {
            
            // Calculate expected balances after minting
            let balancesBefore = {}
            let balancesAfterExpected = {};

            for(let i = 0; i < addresses.length; ++i) {
                addr = addresses[i];
                addrAgg = aggregators[i];
                let balanceAgg = await token.balanceOf.call(addrAgg);
                let balance = await token.balanceOf.call(addr);
                

                if (balancesBefore[addr] === undefined) balancesBefore[addr] = balance;
                if (balancesAfterExpected[addr] === undefined) balancesAfterExpected[addr] = balance;
                if (balancesBefore[addrAgg] === undefined) balancesBefore[addrAgg] = balanceAgg;
                if (balancesAfterExpected[addrAgg] === undefined) balancesAfterExpected[addrAgg] = balanceAgg;

                var aggReward = values[i].mul(aggPercent).div(new BN(100));
                var creatorReward = values[i].sub(aggReward);

                balancesAfterExpected[addrAgg] = balancesAfterExpected[addrAgg].add(aggReward);
                balancesAfterExpected[addr] = balancesAfterExpected[addr].add(creatorReward);

                //console.log(`balancesAfterExpected[${addrAgg}] = ${balancesAfterExpected[addrAgg]}`)
            }

            // Perform the bulkMint
            await minter.bulkMintAggregator(addresses, values, aggregators, {from: creator});
            let balanceAfter = {}
            let allAddresses = addresses.concat(aggregators);
            
            // Check that balances are correct
            for(let i = 0; i < allAddresses.length; ++i) {
                let addr = allAddresses[i];
                balanceAfter[addr] = await token.balanceOf.call(addr);
                expect(balanceAfter[addr].toString()).to.equal(balancesAfterExpected[addr].toString());
            }
            
        });

        it('28% and 72% enforced in multiple mints instead of 1 for entire period', async () => {
            // Calculate expected balances after minting
            let balancesBefore = {}
            let balancesAfterExpected = {};

            for(let i = 0; i < addresses.length; ++i) {
                addr = addresses[i];
                addrAgg = aggregators[i];
                let balanceAgg = await token.balanceOf.call(addrAgg);
                let balance = await token.balanceOf.call(addr);
                

                if (balancesBefore[addr] === undefined) balancesBefore[addr] = balance;
                if (balancesAfterExpected[addr] === undefined) balancesAfterExpected[addr] = balance;
                if (balancesBefore[addrAgg] === undefined) balancesBefore[addrAgg] = balanceAgg;
                if (balancesAfterExpected[addrAgg] === undefined) balancesAfterExpected[addrAgg] = balanceAgg;

                var aggReward = values[i].mul(aggPercent).div(new BN(100));
                var creatorReward = values[i].sub(aggReward);

                balancesAfterExpected[addrAgg] = balancesAfterExpected[addrAgg].add(aggReward);
                balancesAfterExpected[addr] = balancesAfterExpected[addr].add(creatorReward);

                //console.log(`balancesAfterExpected[${addrAgg}] = ${balancesAfterExpected[addrAgg]}`)
            }

            // Perform the bulkMint
            let sz = addresses.length;
            await minter.bulkMintAggregator(addresses.slice(0, 2), values.slice(0, 2), aggregators.slice(0,2), {from: creator});
            await minter.bulkMintAggregator(addresses.slice(2, sz), values.slice(2, sz), aggregators.slice(2, sz), {from: creator});
            
            let balanceAfter = {}
            let allAddresses = addresses.concat(aggregators);
            
            // Check that balances are correct
            for(let i = 0; i < allAddresses.length; ++i) {
                let addr = allAddresses[i];
                balanceAfter[addr] = await token.balanceOf.call(addr);
                expect(balanceAfter[addr].toString()).to.equal(balancesAfterExpected[addr].toString());
            }
        });

        it('reverts if sum of values > 10000e18', async () => {
            var val = [new BN('1000000000000000000000'),new BN('9000000000000000000001')]
            var addr = [accounts[0], accounts[1]];
            var agg = [accounts[8], accounts[7]];
            
            try{
                await minter.bulkMintAggregator(addr, val, agg);
                expect.fail();
            } catch (error)
            {
                expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
            }
        })

        it('reverts if sum of values > tokens remaining in period', async () => {
            var val1 = [new BN('1000000000000000000000')]
            var val2 = [new BN('9000000000000000000001')]
            await minter.bulkMintAggregator([accounts[0]], val1, [accounts[8]]);
            try{
                await minter.bulkMintAggregator([accounts[1]], val2, [accounts[2]]);
                expect.fail();    
            } catch (error) {
                expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
            }
            
        });


        it ('test gas for 100 addresses', async () => {
            var val = [];
            var addr = [];
            var agg = [];
            for(let i = 0; i < 100; ++i) {
                val.push(new BN('100000000000000000000'))
                addr.push(accounts[1]);
                agg.push(accounts[9]);
            }
            await minter.bulkMintAggregator(addr, val, agg);
            expect(val.length).to.equal(100);

        })


        // it('mint reward halved after 1700 periods', async () => {
        //     for(let i = 0; i < 1699; ++i) {
        //         await minter.bulkMintAggregator(addresses,values,aggregators);
        //     }
        //     let mintAmount = await minter.mintAmount.call();
        //     let mintAmountToken = await token.mintAmount.call();
        //     expect(mintAmount.toString()).to.equal('10000000000000000000000');
        //     expect(mintAmountToken.toString()).to.equal('10000000000000000000000');

        //     await minter.bulkMintAggregator(addresses,values,aggregators);
        //     let mintAmountAfter = await minter.mintAmount.call();
        //     let mintAmountTokenAfter = await token.mintAmount.call();
        //     expect(mintAmountAfter.toString()).to.equal('5000000000000000000000');
        //     expect(mintAmountTokenAfter.toString()).to.equal('5000000000000000000000');
            
        
        // })

        it('mint period increments by 1 in 1 bulk mint', async () => {
            let periodBefore = await minter.period.call();
            let periodBeforeToken = await token.period.call();
            expect(periodBeforeToken.toString()).to.equal(periodBefore.toString());
            await minter.bulkMintAggregator(addresses, values, aggregators);
            let periodAfter = await minter.period.call();
            let periodTokenAfter = await minter.period.call();
            expect(periodAfter.toString()).to.equal(periodBefore.add(new BN(1)).toString());
            expect(periodTokenAfter.toString()).to.equal(periodBefore.add(new BN(1)).toString());
        })

        it('mint period increments by 1 in mint period > 1 bulkMintAggregatorCall', async () => {
            let sz = addresses.length;
            let periodBefore = await minter.period.call();
            let periodBeforeToken = await token.period.call();
            expect(periodBeforeToken.toString()).to.equal(periodBefore.toString());
            await minter.bulkMintAggregator(addresses.slice(0,1), values.slice(0,1), aggregators.slice(0,1));


            let periodAfter1 = await minter.period.call();
            let periodTokenAfter1 = await minter.period.call();
            expect(periodAfter1.toString()).to.equal(periodBefore.toString());
            expect(periodTokenAfter1.toString()).to.equal(periodBefore.toString());
            await minter.bulkMintAggregator(addresses.slice(1,sz), values.slice(1,sz), aggregators.slice(1,sz));
            

            let periodAfter = await minter.period.call();
            let periodTokenAfter = await minter.period.call();
            expect(periodAfter.toString()).to.equal((new BN(1)).toString());
            expect(periodTokenAfter.toString()).to.equal((new BN(1)).toString());
        })

        it('reverts if minting over cap', async () => {
            let amountOverCap = "35000000000000000000000000";
            try{
                let status = await minter.bulkMintAggregator([accounts[1]], [amountOverCap], aggregators);
                expect.fail();
            } catch (error)
            {
                expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
            }

        })

        it('reverts if addresses.length > values.length', async () => {
            try {
                await minter.bulkMintAggregator([accounts[1], accounts[2]], [1000], aggregators);
                expect.fail()
            } catch (error)
            {
                expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
            }

        })

        it('reverts if addresses.length < values.length', async () => {
            try {
                await minter.bulkMintAggregator([accounts[1]], [1000, 2000], aggregators);
                expect.fail()
            } catch (error)
            {
                expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
            }

        })

        it('reverts if addresses.length empty', async () => {
            try {
                await minter.bulkMintAggregator([], [1000, 2000], aggregators);
                expect.fail()
            } catch (error)
            {
                expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
            }
        })



    })


    describe('transfer to new mint contract', () => {
        let aggregators = [accounts[7]];
        let addresses = [accounts[0]];
        let creatorPercent = new BN(72);
        let aggPercent = new BN(100 - creatorPercent);
        let values = [new BN('10000000000000000000000')];

        it('addMinter gives new contract minting role', async () => {
            minterV2 = await RaeMintContract.new(token.address, {from:creator});
            await minter.addMinter(minterV2.address);
            let balanceBefore = await token.balanceOf.call(accounts[0]);
            let mintAmount = 10;
            await minterV2.bulkMintAggregator(addresses, values, aggregators);
            let balanceAfter = await token.balanceOf.call(accounts[0]);
            expect('7200000000000000000000').to.equal(balanceAfter.toString());
        })

        it('after revoke, mint contract can not mint', async () => {
            await minter.renounceMintingRole();
            try {
                await minter.bulkMintAggregator(addresses, values, aggregators);
                expect.fail();
            } catch (error) {
                expect(error.message).to.equal(REVERT_ERROR_MESSAGE);
            }
        })
        
    })
    


})