// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        // Mint 20,000 tokens to the deployer's address
        _mint(msg.sender, 20000 * 10 ** uint256(decimals()));
    }

    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }
}
