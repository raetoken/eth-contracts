pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";


/**
@dev RaeToken Contract
requirements:
 - address that deployed RaeToken can pause contract and release pauseRole in future
 - address that deployed RaeToken has mintRole and can release mintRole in future
 - RaeMintContract has mintRole after deployment
 - totalSupply is capped at 34 million RAE = 34000000 RAE, or 34000000e18 ROK (1 RAE = 1e18 ROK)
 - every 1700 _mintPeriods _mintAmount is halved
 - _mintAmount starts at 10000 RAE = 10000e18 ROK
 - halveEvery can never be changed
 */
contract RaeToken is ERC20, ERC20Detailed, ERC20Mintable, ERC20Capped, ERC20Burnable, ERC20Pausable {

    uint256 private _mintAmount = 10000e18;
    uint256 private _mintPeriods = 0;
    uint256 private _halveEvery = 1700; // halve mint amount every 1700 mint periods

    constructor(string memory name, string memory symbol, uint8 decimals, uint256 cap)
        ERC20Burnable()
        ERC20Mintable()
        ERC20Capped(cap)
        ERC20Detailed(name, symbol, decimals)
        ERC20Pausable()
        ERC20()
    public {}

    /**
    * @dev perform a minting period
    * requirements:
    * - addresses.length == values.length != 0
    * - only addresses with minter role should be able to call this function
    * - totalSent == _mintAmount
    * - every time this function returns successfully (true) _mintPeriods is incremented by 1
    * - every 1700 _mintPeriods _mintAmount is halved. e.g. when _mintPeriods = 1700 then _mintAmount = 5000e18
    * - addresses[i] is minted values[i], accepatable to have duplicate addresses
    @param addresses array of addresses where amount minted to addresses[i] is values[i]
    @param values array of token amounts that add up to _mintAmount
     */
    function mintingPeriod(address[] memory addresses, uint256[] memory values) public onlyMinter returns (bool) {
        
        uint256 totalSent = 0;
        require(addresses.length > 0);
        require(addresses.length == values.length);

        for(uint256 i = 0; i < addresses.length; ++i) {
            totalSent = totalSent.add(values[i]);
            _mint(addresses[i], values[i]);
        }

        require(totalSent == _mintAmount);
        _mintPeriods = _mintPeriods.add(1);
        if(_mintPeriods % _halveEvery == 0) _mintAmount = _mintAmount.div(2);
        return true;
    }

    function period() public view returns (uint256){
        return _mintPeriods;
    }

    function mintAmount() public view returns (uint256){
        return _mintAmount;
    }

}