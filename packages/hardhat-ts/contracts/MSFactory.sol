// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './MultiSigVault.sol';

contract MSFactory {
  address[] multiSigVaults;

  // not all of the fields are necessary, but they sure are useful
  event CreateMultiSigVault(
    uint256 indexed contractId,
    address indexed contractAddress,
    address creator,
    string name,
    uint256 timestamp,
    address[] owners,
    uint256 confirmationsRequired
  );

  constructor() {}

  /**
        @param name for better frontend UX
     */
  function createMultiSigVault(
    string memory name,
    address[] memory owners,
    uint256 confirmationsRequired
  ) public {
    uint256 id = multiSigVaults.length;
    MultiSigVault mss = new MultiSigVault(owners, confirmationsRequired);
    multiSigVaults.push(address(mss));

    emit CreateMultiSigVault(id, address(mss), msg.sender, name, block.timestamp, owners, confirmationsRequired);
  }

  function numberOfContracts() public view returns (uint256) {
    return multiSigVaults.length;
  }

  function contractById(uint256 id) public view returns (address) {
    return multiSigVaults[id];
  }
}
