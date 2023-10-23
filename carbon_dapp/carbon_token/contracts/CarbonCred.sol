//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract CarbonCred is ERC20PresetMinterPauser, ERC20Capped {
    using SafeMath for uint256;

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 supply,
        uint256 initialSupply,
        address beneficiary
    )
        ERC20PresetMinterPauser(tokenName, tokenSymbol)
        ERC20Capped(SafeMath.mul(supply, 1 ether))
    {
        _mint(beneficiary, SafeMath.mul(initialSupply, 1 ether));
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20, ERC20PresetMinterPauser) {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _mint(
        address account,
        uint256 amount
    ) internal virtual override(ERC20, ERC20Capped) {
        require(totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
        super._mint(account, amount);
    }
}
