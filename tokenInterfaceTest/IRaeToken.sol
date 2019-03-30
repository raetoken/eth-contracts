pragma solidity 0.5.7; 

/**
 * @title RaeToken interface
 * @dev interface for RaeToken to be used in minting contract 
 */
interface IRaeToken {

    /**
    RaeToken specific methods
     */
    function mintingPeriod(address[] memory addresses, uint256[] memory values) public onlyMinter returns (bool);
    function period() public view returns (uint256);
    function mintAmount() public view returns (uint256);

    /**
    Standard ERC20 methods
     */
    function transfer(address to, uint256 value) external returns (bool);

    function approve(address spender, uint256 value) external returns (bool);

    function transferFrom(address from, address to, uint256 value) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address who) external view returns (uint256);

    function allowance(address owner, address spender) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
    ERC20Detailed methods
     */
    function name() public view returns (string memory);

    function symbol() public view returns (string memory);

    function decimals() public view returns (uint8);

    /**
    ERC20Capped methods
     */
    function cap() public view returns (uint256);

    function _mint(address account, uint256 value) internal;


    /**
    ERC20Mintable methods
     */
    function mint(address to, uint256 value) public onlyMinter returns (bool);

    /**
    MinterRole methods
     */
    event MinterAdded(address indexed account);

    event MinterRemoved(address indexed account);

    // modifier onlyMinter();

    function isMinter(address account) public view returns (bool);

    function addMinter(address account) public onlyMinter;

    function renounceMinter() public;

    function _addMinter(address account);

    function _removeMinter(address account);

    /**
    ERC20 Burnable methods
     */
    function burn(uint256 value) public;

    function burnFrom(address from, uint256 value) public;

    /**
    ERC20Pausable methods
     */

    function transfer(address to, uint256 value) public whenNotPaused returns (bool);

    function transferFrom(address from, address to, uint256 value) public whenNotPaused returns (bool);

    function approve(address spender, uint256 value) public whenNotPaused returns (bool);

    function increaseAllowance(address spender, uint addedValue) public whenNotPaused returns (bool success);

    function decreaseAllowance(address spender, uint subtractedValue) public whenNotPaused returns (bool success);

    /**
    Pausable Methods
     */
    function paused() public view returns (bool);

    // modifier whenNotPaused();

    // modifier whenPaused();

    function pause() public onlyPauser whenNotPaused;

    function unpause() public onlyPauser whenPaused;

    /**
    PauserRole methods
     */
    event PauserAdded(address indexed account);
    event PauserRemoved(address indexed account);

    // modifier onlyPauser();

    function isPauser(address account) public view returns (bool);

    function addPauser(address account) public onlyPauser;

    function renouncePauser() public;

    function _addPauser(address account) internal;

    function _removePauser(address account) internal;

  
}