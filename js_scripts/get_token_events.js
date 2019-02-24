

async function checkForBurnEvents()
{
    var ROKToken = artifacts.require("../contracts/ROKToken.sol");
    var ROKMintContract = artifacts.require("../contracts/ROKMintContract.sol");
    let accounts = await web3.eth.getAccounts();
    let rokfin = accounts[3];
    let nytimes = accounts[4];
    let fedserver = accounts[0];
    let zero_address = '0x0000000000000000000000000000000000000000';

    let token = await ROKToken.deployed();
    let minter = await ROKMintContract.deployed();

    // Mint some tokens to rokfin and nytimes
    //let response = await minter.mint(rokfin, 1000, {from: fedserver});
    //let response2 = await minter.mint(nytimes, 500, {from:fedserver});

    // Burn some tokens as rokfin 
    //await token.burn(20, {from: rokfin});
    //await token.burn(33, {from: rokfin});
    //await token.burn(10, {from: nytimes});

    // filter for burn events from rokfin
    token.getPastEvents('Transfer', {
        filter: {from: rokfin, to: zero_address}, // Using an array means OR: e.g. 20 or 23
        fromBlock: 0,
        toBlock: 'latest'
    }, (error, events) => { console.log(events); })
    .then((events) => {
        events.forEach(function(event){
            console.log(
                "\n---------Burn Event ---------\n" + 
                "txhash: " + event.transactionHash + "\n" +
                "blockNumber: " + event.blockNumber + "\n" +
                "from: " + event.returnValues.from + "\n" +
                "to: " + event.returnValues.to + "\n" +
                "value: " + event.returnValues.value + "\n"

            )


        });
    });




}

checkForBurnEvents();

