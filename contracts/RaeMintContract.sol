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
    * @dev mint tokens and assign them to address
    * @param to address to mint tokens to
    * @param value how many tokens to mint to specified address
    * @return A boolean that indicates the operation was successful
     */
    function mint(address to, uint256 value) public onlyOwner returns (bool)
    {
        return _token.mint(to, value);
    }

    /**
     * @dev mint tokens, to address 'to' taking 28 percent and giving to aggregator
     * @param to address to mint tokens to 
     * @param value how many tokens to mint to specified address
     * @param aggregator the aggregator address to award 28 percent to 
     * @return A boolean that indicates the operation was successful
      */
    function mintAggregator(address to, uint256 value, address aggregator) public onlyOwner returns (bool)
    {
        uint256 aggregatorReward = value.mul(_pct).div(100);
        uint256 creatorReward = value.sub(aggregatorReward);
        _token.mint(to, creatorReward);
        return _token.mint(aggregator, aggregatorReward);
    }


    /**
    * @dev perform a bulk mint, addresses[i] will be minted values[i] tokens. 
    * Will revert if length of addresses is less than or equal to 0 or,
    * length of addresses is not equal length of values. 
    * @param addresses array of addresses that will receive tokens
    * @param values array of values to send to addresses
    * @return A boolean that indicates the operation was successful
     */
    function bulkMintAggregator(address[] memory addresses, uint256[] memory values, address[] memory aggregators) public onlyOwner returns (bool)
    {
        uint256 totalSent = 0;
        require(addresses.length > 0);
        require(addresses.length == values.length);
        require(addresses.length == aggregators.length);

        for(uint256 i = 0; i < addresses.length; ++i)
        {
            uint256 aggregatorReward = values[i].mul(_pct).div(100);
            uint256 creatorReward = values[i].sub(aggregatorReward);
            totalSent = totalSent.add(aggregatorReward + creatorReward);
            _token.mint(addresses[i], creatorReward);
            _token.mint(aggregators[i], aggregatorReward);
        }
        require(totalSent == _mintAmount);
        _mintPeriods += 1;
        return true;
    }

    
    
    /**
    * @dev perform a bulk mint, addresses[i] will be minted values[i] tokens. 
    * Will revert if length of addresses is less than or equal to 0 or,
    * length of addresses is not equal length of values. 
    * @param addresses array of addresses that will receive tokens
    * @param values array of values to send to addresses
    * @return A boolean that indicates the operation was successful
     */
    function bulkMint(address[] memory addresses, uint256[] memory values) public onlyOwner returns (bool)
    {
        require(addresses.length > 0);
        require(addresses.length == values.length);

        for(uint256 i = 0; i < addresses.length; ++i)
        {
            _token.mint(addresses[i], values[i]);
        }
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


    /**
    @dev get the token contract's address to which this contract is issuing minting calls
    @return address of token contract
     */
    function token() public view returns (address)
    {
        return address(_token);
    }


    

    


}