// SPDX-License-Identifier: Pepega
pragma solidity ^0.8.20;

interface IERC721 {
    function owner() external view returns (address owner);

    function getMaxSupply() external view returns (uint256);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function publicMint(address _to) external returns (uint256);
}
