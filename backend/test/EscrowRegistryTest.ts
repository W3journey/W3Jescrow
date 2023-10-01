import { ethers } from "hardhat"
import { expect } from "chai"
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"

describe("EscrowRegistry", function () {
  async function deployEscrowRegistryFixture() {
    const deposit = ethers.parseEther("1")

    const [depositor, beneficiary, arbiter] = await ethers.getSigners()

    const EscrowRegistryFactory = await ethers.getContractFactory(
      "EscrowRegistry"
    )
    const escrowRegistry = await EscrowRegistryFactory.deploy()

    await escrowRegistry.waitForDeployment()

    return { escrowRegistry, depositor, beneficiary, arbiter, deposit }
  }

  it("should deploy a new contract and fund it with 1 Ether", async function () {
    const { escrowRegistry, depositor, beneficiary, arbiter, deposit } =
      await loadFixture(deployEscrowRegistryFixture)

    const newEscrow = await escrowRegistry
      .connect(depositor)
      .deployEscrowContract(arbiter.address, beneficiary.address, BigInt(0), {
        value: deposit,
      })

    const deployedContracts = await escrowRegistry.getEscrowAddresses()

    const balance = await ethers.provider.getBalance(deployedContracts[0])
    expect(balance).to.eq(BigInt(ethers.parseEther("1")))
  })

  it("should deploy a new contract and the new contract should have a arbiter feeBps of 125n", async () => {
    const { escrowRegistry, depositor, beneficiary, arbiter, deposit } =
      await loadFixture(deployEscrowRegistryFixture)

    const deployNewEscrow = await escrowRegistry
      .connect(depositor)
      .deployEscrowContract(arbiter.address, beneficiary.address, BigInt(125), {
        value: deposit,
      })

    await deployNewEscrow.wait()
    const deployedContracts = await escrowRegistry.getEscrowAddresses()
    const escrowContract = await ethers.getContractAt(
      "Escrow",
      deployedContracts[0],
      depositor
    )

    const feeBps = await escrowContract.feeBps()

    expect(feeBps).to.equal(BigInt(125))
  })

  describe("after approval from address other than the arbiter", () => {
    it("should revert", async () => {
      const { escrowRegistry, depositor, beneficiary, arbiter, deposit } =
        await loadFixture(deployEscrowRegistryFixture)

      const newEscrow = await escrowRegistry
        .connect(depositor)
        .deployEscrowContract(arbiter.address, beneficiary.address, BigInt(0), {
          value: deposit,
        })

      const deployedContracts = await escrowRegistry.getEscrowAddresses()

      const firstContract = deployedContracts[0]

      const escrowContract = await ethers.getContractAt("Escrow", firstContract)

      await expect(escrowContract.connect(beneficiary).approve()).to.be.reverted
    })
  })

  describe("after approval from the arbiter", () => {
    it("should transfer balance to beneficiary, and fee to arbiter", async () => {
      const { escrowRegistry, depositor, beneficiary, arbiter, deposit } =
        await loadFixture(deployEscrowRegistryFixture)

      await escrowRegistry
        .connect(depositor)
        .deployEscrowContract(
          arbiter.address,
          beneficiary.address,
          BigInt(125),
          {
            value: deposit,
          }
        )

      const deployedContracts = await escrowRegistry.getEscrowAddresses()
      const newContractAddr = deployedContracts[0]

      const escrowContract = await ethers.getContractAt(
        "Escrow",
        newContractAddr
      )

      const arbiterBefore = await ethers.provider.getBalance(arbiter.address)
      const beneficiaryBefore = await ethers.provider.getBalance(
        beneficiary.address
      )
      const feeBps = await escrowContract.feeBps()

      const arbiterFee = (deposit * feeBps) / BigInt(10_000)
      const beneficiaryAmount = deposit - arbiterFee

      const approveTxn = await escrowContract.connect(arbiter).approve()
      const txnReceipt = await approveTxn.wait()

      const arbiterAfter = await ethers.provider.getBalance(arbiter.address)
      const beneficiaryAfter = await ethers.provider.getBalance(
        beneficiary.address
      )

      const arbiterExpectedAfter = arbiterBefore + arbiterFee
      expect(beneficiaryAfter - beneficiaryBefore).to.eq(beneficiaryAmount)
      expect(arbiterAfter).to.eq(arbiterExpectedAfter - txnReceipt?.fee!)
    })
  })
})
