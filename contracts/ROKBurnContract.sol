pragma solidity ^0.5.0;

import "./ROKToken.sol";

contract ROKBurnContract {
    address owner;
    address tokenContract;

    constructor() public 
    {
        owner = msg.sender;

    }


}