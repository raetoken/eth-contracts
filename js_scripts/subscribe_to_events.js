
async function subscribeToEvents()
{
    var ROKToken = artifacts.require("../contracts/ROKToken.sol");
    let accounts = await web3.eth.getAccounts();
    let rokfin = accounts[3];
    let nytimes = accounts[4];
    let fedserver = accounts[0];

    let token = await ROKToken.deployed();

    token.allEvents({
        filter: {from: rokfin}, // Using an array means OR: e.g. 20 or 23
        fromBlock: 0
    }, (error, event) => { console.log(event); })
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


        })
    });
}

subscribeToEvents();