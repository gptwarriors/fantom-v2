pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CyberChips is ERC20 {
    constructor(uint256 initialSupply) ERC20("Cyber Chips", "CCS") {
        _mint(msg.sender, initialSupply);
    }
    function faucet() public {
        _mint(msg.sender,1000*10**18);
    }
}