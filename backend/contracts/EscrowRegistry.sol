// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Escrow {
  address public arbiter;
  address public beneficiary;
  address public depositor;

  uint public escrowAmount;
  uint public feeBps;

  bool public isApproved;

  constructor(address _arbiter, address _beneficiary, address _depositor, uint _feeBps) payable {
    arbiter = _arbiter;
    beneficiary = _beneficiary;
    feeBps = _feeBps;
    depositor = _depositor;
    escrowAmount = msg.value;
  }

  event Approved(uint beneficiaryAmount, uint arbiterFee);

  function approve() external {
    require(msg.sender == arbiter);
    uint balance = address(this).balance;
    uint arbiterFee = balance * feeBps / 10_000;
    uint beneficiaryAmount = balance - arbiterFee;
    (bool feeSent, ) = payable(arbiter).call{ value: arbiterFee }("");
    (bool sent, ) = payable(beneficiary).call{ value: beneficiaryAmount }("");
    require(feeSent, "Failed to send Arbiter share.");
    require(sent, "Failed to send Beneficiary share.");
    emit Approved(beneficiaryAmount, arbiterFee);
    isApproved = true;
  }

  function getContractData() public view returns (address, address, address, uint, uint, bool) {
    return (arbiter, beneficiary, depositor, escrowAmount, feeBps, isApproved);
  }
}

contract EscrowRegistry {
  address[] public deployedContractAddresses;

  event ContractDeployed(address indexed deployer, address indexed newContract);

  function deployEscrowContract(address _arbiter, address _beneficiary, uint _feeBps) public payable {
    address newInstance = address(new Escrow{value: msg.value}(
      _arbiter,
      _beneficiary,
      msg.sender,
      _feeBps
    ));
    deployedContractAddresses.push(newInstance);
    emit ContractDeployed(msg.sender, newInstance);
  }

  function getEscrowAddresses() public view returns (address[] memory) {
    return deployedContractAddresses;
  }

}