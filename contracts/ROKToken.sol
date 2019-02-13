pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";
import "./ROKMintContract.sol";



contract ROKToken is ERC20, ERC20Detailed, ERC20Mintable, ERC20Capped, ERC20Burnable {

    constructor(string memory name, string memory symbol, uint8 decimals, uint256 cap)
        ERC20Burnable()
        ERC20Mintable()
        ERC20Capped(cap)
        ERC20Detailed(name, symbol, decimals)
        ERC20()
    public {}
    

}