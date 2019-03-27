pragma solidity ^0.5.0;

import "./RaeToken.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract RaeMintContract is Ownable {
    using SafeMath for uint256;

    RaeToken private _token;
    uint256 constant _pct = 28;
    uint256 private _mintAmount = 10000e18;
    uint256 private _mintPeriods = 0;
    
    
    /**
    * @dev create minting contract, passing token contract that will be the target of minting.
    * On deployment, deployer of RaeToken contract will be given minterRole. With that minterRole the deployer will
    * assign minterRole to this contract, and finally the deployer will revoke minterRole from himself so 
    * that this contract is the only possible minter for RaeToken. Owner of this contract will be the only person
    * who can issue mint, bulkMint functions
     */
    constructor(RaeToken token) Ownable() public 
    {
        _token = token;
    }

    /**
    * @dev perform a bulk mint, only callable by addresses that have mintRole. aggregators[i] will be minted _pct * values[i] and
    * addresses[i] will be minted values[i] - pct * values[i]
    * Will revert if:
    * addresses.length <= 0
    * the adresses.length != values.length or addresses.length != aggregators.length
    * totalSent != _mintAmount

    * @param addresses array of addresses where amount minted to addresses[i] is values[i] - _pct * values[i]
    * @param values array of mint values
    * @param aggregators array of addresses where amount minted to aggregators[i] is _pct * values[i]
    * @return A boolean that indicates the operation was successful
     */
    function bulkMintAggregator(address[] memory addresses, uint256[] memory values, address[] memory aggregators) public onlyOwner returns (bool)
    {

        uint256 totalSent = 0;
        require(addresses.length > 0);
        require(addresses.length == values.length);
        require(addresses.length == aggregators.length);

        uint256 addrSize = addresses.length;
        uint256 size = addrSize.add(addrSize);
        address[] memory bulkAddresses = new address[](size);
        uint256[] memory bulkValues = new uint256[](size);

        uint256 j = 0;
        for(uint256 i = 0; i < addresses.length; ++i)
        {
            uint256 aggregatorReward = values[i].mul(_pct).div(100);
            uint256 creatorReward = values[i].sub(aggregatorReward);
            totalSent = totalSent.add(aggregatorReward + creatorReward);
            
            // add address[i] and aggregators[i] to bulkAddresses
            bulkAddresses[j] = addresses[i];
            bulkValues[j] = creatorReward;

            bulkAddresses[j+1] = aggregators[i];
            bulkValues[j+1] = aggregatorReward;

            // increment j by 2
            j = j + 2;
        }
        
        require(totalSent == _mintAmount);
        _token.mintingPeriod(bulkAddresses, bulkValues); // perform the mint for this period
        _mintPeriods += 1;
        if(_mintPeriods % 1700 == 0) _mintAmount = _mintAmount.div(2);
        return true;
    }



    /**
     * @dev function should be used if switching minting contracts. First add address of new minting contract as minter, then renounce
     * mintingRole for this contract, making it unable to mint
     */
    function addMinter(address addr) public onlyOwner returns (bool)
    {
        _token.addMinter(addr);
        return true;
    }

    /**
     * @dev renounce minting role from this smart contract, should be used if switching minting contracts
     */
    function renounceMintingRole() public onlyOwner returns (bool)
    {
        _token.renounceMinter();
        return true;
    }

    
    function period() public view returns (uint256){
        return _mintPeriods;
    }

    function mintAmount() public view returns (uint256){
        return _mintAmount;
    }


    /**
    @dev get the token contract's address to which this contract is issuing minting calls
    @return address of token contract
     */
    function token() public view returns (address)
    {
        return address(_token);
    }


    

    


}