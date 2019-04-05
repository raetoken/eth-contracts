const RaeToken = artifacts.require("RaeToken");
const RaeMintContract = artifacts.require("RaeMintContract");
const BN = web3.utils.BN;

contract('2_initial_deployment', function(accounts) {
    let creator = accounts[0];
    let token;
    let minter;
    const REVERT_ERROR_MESSAGE = 'Returned error: VM Exception while processing transaction: revert';

    let E18 = '000000000000000000'
    let firstMintAmount = new BN('216000' + E18);
    let initialTotalSupply = new BN('84000' + E18);

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


        it('Token supply is initially 84,000 RAE', async () => {
            let totalSupply = await token.totalSupply.call();
            expect(totalSupply.toString()).to.equal(initialTotalSupply.toString());
        })

        it('Creator of token contract has all tokens',async () => {
            expect((await token.balanceOf.call(creator)).toString()).to.equal(initialTotalSupply.toString())
        })

        it('Token cap is correct', async () => {
            let cap = await token.cap.call();
            expect(cap.toString()).to.equal('34000000000000000000000000');
        })



    });

    


})