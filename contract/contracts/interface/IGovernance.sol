// SPDX-License-Identifier: Pepega
pragma solidity ^0.8.20;

interface IGovernance {
    function votingPeriod() external view returns (uint256);

    function state(uint256 proposalId) external view returns (uint8);

    function proposalThreshold() external view returns (uint256);

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256);

    function queue(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) external returns (uint256);

    function execute(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) external payable returns (uint256);

    function cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) external returns (uint256);

    function castVote(uint256 proposalId, uint8 support) external returns (uint256);

    function clock() external view returns (uint48);
}
