pragma solidity ^0.5.0;

import "./ROKToken.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract ROKMintContract is Ownable {
    ROKToken private _token;
    
    constructor(ROKToken token) Ownable() public 
    {
        _token = token;
    }

    function mint(address to, uint256 value) public onlyOwner returns (bool)
    {
        return _token.mint(to, value);
    }

    function token() public view returns (address)
    {
        return address(_token);
    }

    

    


}