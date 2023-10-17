// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";

contract ERC721Mock is ERC721, Ownable, EIP712, ERC721Votes {
    uint256 private _nextTokenId;
    uint256 private max_supply;

    constructor(
        address initialOwner,
        string memory _name,
        string memory _symbol,
        uint256 supply
    ) ERC721(_name, _symbol) Ownable(initialOwner) EIP712(_name, "1") {
        max_supply = supply;
    }

    function getMaxSupply() public view returns (uint256) {
        return max_supply;
    }

    // function _afterTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal override(ERC721, ERC721Votes) {
    //     super._afterTokenTransfer(from, to, firstTokenId, batchSize);
    // }

    // Overrides IERC6372 functions to make the token & governor timestamp-based
    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    // solhint-disable-next-line func-name-mixedcase
    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function publicMint(address _to) external returns (uint256) {
        uint256 _tokenId = _nextTokenId;
        require(_tokenId < max_supply, "Max supply reached");
        _mint(_to, _tokenId);
        _nextTokenId++;
        return _tokenId;
    }

    function mint(address _to, uint256 _tokenId) external {
        _mint(_to, _tokenId);
    }

    function setOwner(address _newOwner) external onlyOwner {
        transferOwnership(_newOwner);
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Votes) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Votes) {
        super._increaseBalance(account, value);
    }
}
