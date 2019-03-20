const RaeToken = artifacts.require("RaeToken");
const RaeMintContract = artifacts.require("RaeMintContract");

contract('2_initial_deployment', function(accounts) {
    let creator = accounts[0];
    let token;
    let minter;
    const REVERT_ERROR_MESSAGE = 'Returned error: VM Exception while processing transaction: revert';

    beforeEach(async function() {
        token = await RaeToken.deployed();
        minter = await RaeMintContract.deployed();
    })

    describe('MintContract deployment checks', () => {

        it('mint contract has correct owner', async () => {
            let owner = await minter.owner.call();
            expect(owner).to.equal(creator);
        });

        it('mint contract has Token contract as target', async () => {
            let target = await minter.token.call();
            expect(target).to.equal(token.address);
        });

    });

    describe('Token deployment checks', () => {

        it('MintContract has minting role', async ()=>{
            let res = await token.isMinter.call(minter.address);
            expect(res).to.equal(true);
        });

        it('Token creator has minting role', async ()=>{
            let res = await token.isMinter.call(creator);
            expect(res).to.equal(true);
        });

        it('Token supply is initially 0', async () => {
            let totalSupply = await token.totalSupply.call();
            expect(totalSupply.toNumber()).to.equal(0);
        })

        it('Token cap is correct', async () => {
            let cap = await token.cap.call();
            expect(cap.toString()).to.equal('34000000000000000000000000');
        })



    });

    


})