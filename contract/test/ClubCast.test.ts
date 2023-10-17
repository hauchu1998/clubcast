import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { expect } from "chai";
import {
  ClubCast,
  ERC721Mock,
  ERC20Mock,
  ClubCastGovernor,
} from "../typechain-types";
import { randomBytes } from "crypto";
import { token } from "../typechain-types/@openzeppelin/contracts";

export const generateRandomNumber = () => randomBytes(16).toString("hex");

describe("clubcast", function () {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addr3: SignerWithAddress;
  let addr4: SignerWithAddress;

  // Contracts
  let clubcast: ClubCast;
  let erc721Mock: ERC721Mock;
  let erc721Mock2: ERC721Mock;
  let governance: ClubCastGovernor;
  let governance2: ClubCastGovernor;
  let erc20Mock: ERC20Mock;

  const setupAddresses = async () => {
    [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
  };

  before(async () => {
    await setupAddresses();
    await deployAllContracts();
  });

  const deployAllContracts = async () => {
    // Deploy the clubcast contract
    const Clubcast = await ethers.getContractFactory("ClubCast");
    // Apecoin mainnet ethereum -> 0x4d224452801aced8b2f0aebe155379bb5d594381
    // https://developers.circle.com/developer/docs/usdc-on-testnet

    // Deploy a mock ERC721 contract for testing
    const ERC721Mock = await ethers.getContractFactory("ERC721Mock");
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    const ClubCastGovernor = await ethers.getContractFactory(
      "ClubCastGovernor"
    );

    erc721Mock = await ERC721Mock.deploy(owner.address, "podcast", "POD", 10);
    await erc721Mock.deployed();

    erc721Mock2 = await ERC721Mock.deploy(addr2.address, "club", "CBH", 10);
    await erc721Mock2.deployed();

    erc20Mock = await ERC20Mock.deploy(owner.address, "Token", "TOKEN");
    await erc20Mock.deployed();

    governance = await ClubCastGovernor.deploy(erc721Mock.address, 0, 4);
    governance2 = await ClubCastGovernor.deploy(erc721Mock2.address, 0, 4);

    clubcast = await Clubcast.deploy(erc20Mock.address);
    await clubcast.deployed();
  };

  describe("Publishing videos", function () {
    const clubId = generateRandomNumber();
    it("should return 0 when no publications are present", async function () {
      const count = await clubcast.getPublicationCount(erc721Mock.address);
      expect(count.toNumber()).to.equal(0);
    });

    it("Should create a club and emit event", async function () {
      await expect(
        clubcast.createClub(clubId, erc721Mock.address, governance.address)
      )
        .to.emit(clubcast, "NewClub")
        .withArgs(
          clubId,
          owner.address,
          erc721Mock.address,
          governance.address
        );

      const club = await clubcast.getClubInfo(clubId);
      expect(club.owner).to.equal(owner.address);
      expect(club.erc721Address).to.equal(erc721Mock.address);
      expect(club.governanceAddress).to.equal(governance.address);
    });

    it("Should publish a video and emit event", async function () {
      await expect(clubcast.publishVideo(clubId, 30, "md5Hash"))
        .to.emit(clubcast, "NewPublication")
        .withArgs(30, clubId, owner.address, "md5Hash");

      const count = await clubcast.getPublicationCount(clubId);
      expect(count.toNumber()).to.equal(1);
    });

    it("Should fail if not the owner of the club", async function () {
      await expect(
        clubcast.connect(addr1).publishVideo(clubId, 2, "md5Hash2")
      ).to.be.revertedWith(
        "You must be the owner of the club and the ERC721 contract"
      );
    });

    describe("Tipping content creators", function () {
      it("Should allow tipping a video", async function () {
        // First approve the tokens
        await erc20Mock.connect(owner).approve(clubcast.address, 100);

        const count = await clubcast.getPublicationCount(clubId);
        // Then tip
        await expect(clubcast.connect(owner).tipContentCreator(50, clubId))
          .to.emit(clubcast, "Tipped")
          .withArgs(owner.address, clubId, 50);

        // Validate tip was saved
        const tipAmount = await clubcast.tips(clubId);
        expect(tipAmount).to.equal(50);
      });

      it("Should allow withdrawing tips", async function () {
        // Withdraw tips
        await expect(clubcast.connect(owner).withdrawTips(clubId))
          .to.emit(clubcast, "Withdrawn")
          .withArgs(owner.address, clubId, 50);

        // Validate tips are now 0
        const tipAmount = await clubcast.tips(clubId);
        expect(tipAmount).to.equal(0);
      });
    });

    describe("User -> Club mappings", function () {
      it("Should add user club mappings", async function () {
        await clubcast.connect(addr2).joinClub(clubId);
        const [clubIds, clubTokens] = await clubcast.getUserClubIds(
          addr2.address
        );
        const mappedClubTokens = clubTokens.map((token) => token.toNumber());
        expect(clubIds).to.include.members([clubId]);
        expect(mappedClubTokens).to.include.members([0]);
      });
    });

    describe("Listing Publications (Once Added Mappings)", function () {
      it("Should get the correct publication count", async function () {
        const count = await clubcast.getPublicationCount(clubId);
        expect(count.toNumber()).to.equal(1);
      });

      it("Should list publications correctly", async function () {
        const publicationInfos = await clubcast
          .connect(addr2)
          .listPublications(clubId, addr2.address);

        expect(publicationInfos[0].videoId).to.equal(30);
        expect(publicationInfos[0].publisher).to.equal(owner.address);
        expect(publicationInfos[0].md5Hash).to.equal("md5Hash");
      });
    });
  });
  describe("Multi-user Publication Filtering", function () {
    it("Should carry out a set of more complex minting, connecting and publishing patterns", async function () {
      const clubId = generateRandomNumber();
      const clubId2 = generateRandomNumber();
      await clubcast
        .connect(owner)
        .createClub(clubId, erc721Mock.address, governance.address);
      await clubcast
        .connect(addr2)
        .createClub(clubId2, erc721Mock2.address, governance2.address);

      await clubcast.connect(addr3).joinClub(clubId);
      await clubcast.connect(addr3).joinClub(clubId2);
      await clubcast.connect(addr4).joinClub(clubId);

      // Publish videos targeting specific tokens
      await clubcast.publishVideo(clubId, 3, "md5Hash3");
      await clubcast.publishVideo(clubId, 4, "md5Hash4");
      await clubcast.connect(addr2).publishVideo(clubId2, 5, "md5Hash5");
      const count = await clubcast.getPublicationCount(clubId);
      expect(count.toNumber()).to.equal(2);

      const count2 = await clubcast.getPublicationCount(clubId2);
      expect(count2.toNumber()).to.equal(1);

      await clubcast.publishVideo(clubId, 6, "md5Hash6");
      const countAfterNextPublish = await clubcast.getPublicationCount(clubId);
      expect(countAfterNextPublish.toNumber()).to.equal(3);

      const addr3ClubPublications = await clubcast
        .connect(addr3)
        .listPublications(clubId, addr3.address);

      const addr3Club2Publications = await clubcast
        .connect(addr3)
        .listPublications(clubId2, addr3.address);

      const videoIdsClub = addr3ClubPublications.map((info) =>
        info.videoId.toNumber()
      );
      const md5HashesClub = addr3ClubPublications.map((info) => info.md5Hash);
      expect(videoIdsClub).to.deep.equal([3, 4, 6]);
      expect(md5HashesClub).to.deep.equal(["md5Hash3", "md5Hash4", "md5Hash6"]);

      const videoIdsClub2 = addr3Club2Publications.map((info) =>
        info.videoId.toNumber()
      );
      expect(videoIdsClub2).to.deep.equal([5]);

      await expect(
        clubcast.connect(addr4).listPublications(clubId2, addr4.address)
      ).to.be.rejectedWith("You are not a club member");

      const addr4ClubPublications = await clubcast
        .connect(addr4)
        .listPublications(clubId, addr4.address);
      const addr4VideoIdsClub = addr4ClubPublications.map((info) =>
        info.videoId.toNumber()
      );

      const addr4Md5HashesClub = addr4ClubPublications.map(
        (info) => info.md5Hash
      );
      expect(addr4VideoIdsClub).to.deep.equal([3, 4, 6]);
      expect(addr4Md5HashesClub).to.deep.equal([
        "md5Hash3",
        "md5Hash4",
        "md5Hash6",
      ]);
    });
  });
});
