import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, network } from "hardhat";
import { expect } from "chai";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import {
  ClubCast,
  ERC721Mock,
  ERC20Mock,
  ClubCastGovernor,
} from "../typechain-types";
import { randomBytes } from "crypto";
import { moveBlocks } from "./utils/moveBlocks";

describe("governance", async () => {
  const deploySettings = async () => {
    const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
    const ERC721Mock = await ethers.getContractFactory("ERC721Mock");
    const ClubCastGovernor = await ethers.getContractFactory(
      "ClubCastGovernor"
    );

    const erc721Mock = await ERC721Mock.deploy(
      owner.address,
      "podcast",
      "POD",
      10
    );
    await erc721Mock.deployed();

    const governance = await ClubCastGovernor.deploy(
      erc721Mock.address,
      "ClubCastGovernance",
      1,
      20
    );
    await governance.deployed();

    await erc721Mock.publicMint(owner.address);
    // await erc721Mock.publicMint(owner.address);
    await erc721Mock.publicMint(addr1.address);
    // await erc721Mock.publicMint(addr1.address);
    await erc721Mock.publicMint(addr2.address);
    // await erc721Mock.publicMint(addr2.address);
    await erc721Mock.publicMint(addr3.address);
    // await erc721Mock.publicMint(addr3.address);
    await erc721Mock.publicMint(addr4.address);
    // await erc721Mock.publicMint(addr4.address);

    const call = governance.interface.encodeFunctionData("doNothing");

    // await erc721Mock.transferOwnership(governance.address);
    // await erc721Mock.connect(addr2).delegate(addr1.address);
    await erc721Mock.connect(addr1).delegate(addr1.address);
    await erc721Mock.connect(addr2).delegate(addr2.address);
    await erc721Mock.connect(addr3).delegate(addr3.address);

    await moveBlocks(2);

    const block = await ethers.provider.getBlock("latest");
    expect(await governance.getVotes(addr1.address, block.timestamp - 1)).equal(
      1
    );

    return {
      erc721Mock,
      governance,
      owner,
      addr1,
      addr2,
      addr3,
      addr4,
      call,
    };
  };
  it("Should set the right tokenId", async () => {
    const { erc721Mock, owner, addr1 } = await loadFixture(deploySettings);
    const nftCount = await erc721Mock.balanceOf(owner.address);
    expect(nftCount).to.equal(1);
    expect(await erc721Mock.ownerOf(0)).to.equal(owner.address);
    // expect(await erc721Mock.ownerOf(3)).to.equal(addr1.address);
  });

  it("Should set the right token address", async () => {
    const { erc721Mock, governance } = await loadFixture(deploySettings);
    expect(await governance.token()).to.equal(erc721Mock.address);
  });

  it("should be able to create a proposal", async () => {
    const { governance, call, addr1 } = await loadFixture(deploySettings);
    const proposal = await governance
      .connect(addr1)
      .propose(
        [governance.address],
        ["0"],
        [call.toString()],
        "call for do nothing"
      );
    const proposeReceipt = await proposal.wait(1);
    const proposalId = proposeReceipt.events![0].args!.proposalId;
    await moveBlocks(2);

    const deadLine = await governance.proposalDeadline(proposalId);
    const startTime = await governance.proposalSnapshot(proposalId);
    const period = await governance.votingPeriod();
    expect(deadLine).to.equal(startTime.add(period));
    expect(await governance.state(proposalId)).to.equal(1);
  });

  it("Should be able to vote", async () => {
    const { addr1, addr2, addr3, governance, call } = await loadFixture(
      deploySettings
    );
    const proposal = await governance
      .connect(addr1)
      .propose([governance.address], ["0"], [call], "call for do nothing");
    const proposeReceipt = await proposal.wait(1);
    const proposalId = proposeReceipt.events![0].args!.proposalId;
    await moveBlocks(2);
    await governance.connect(addr1).castVote(proposalId, 1);
    await governance.connect(addr2).castVote(proposalId, 0);
    await governance.connect(addr3).castVote(proposalId, 1);

    await moveBlocks(2);

    expect(await governance.hasVoted(proposalId, addr1.address)).to.equal(true);
    const proposalVotes = await governance.proposalVotes(proposalId);
    console.log(proposalVotes);
  });

  //   it("Should get the quorum", async function () {
  //     const { erc721Mock, governance, call } = await loadFixture(deploySettings);
  //     const blockNumber = await ethers.provider.getBlockNumber();
  //     const supply = await erc721Mock.totalSupply();
  //     const quorum = await governance.quorum(blockNumber - 1);
  //     expect(quorum).to.equal(2);
  //   });
});
