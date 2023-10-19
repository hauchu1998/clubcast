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

export const generateRandomId = () => randomBytes(16).toString("hex");

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
    const clubId = generateRandomId();
    const episodeId = generateRandomId();
    const episodeId2 = generateRandomId();
    it("should return 0 when no episodes are present", async function () {
      const count = await clubcast.getEpisodeCount(erc721Mock.address);
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
      const title = "episode1";
      const description = "description1";
      const ipfsUrl =
        "https://ipfs.io/ipfs/bafybeifpliuby6upaubuhgrn77cqdwxe47wb4iojeikxnxxv24mfr36w3y/IoT_Nexus_100.mp4";
      const timestamp = new Date();
      const createAt = `${timestamp.toLocaleDateString} ${timestamp.toLocaleTimeString}`;
      await expect(
        clubcast.publishEpisode(
          clubId,
          episodeId,
          createAt,
          title,
          description,
          ipfsUrl
        )
      )
        .to.emit(clubcast, "NewEpisode")
        .withArgs(episodeId, clubId, owner.address, ipfsUrl);

      const count = await clubcast.getEpisodeCount(clubId);
      expect(count.toNumber()).to.equal(1);
    });

    it("Should fail if not the owner of the club", async function () {
      const title2 = "episode2";
      const description2 = "description2";
      const ipfsUrl2 =
        "https://ipfs.io/ipfs/bafybeifpliuby6upaubuhgrn77cqdwxe47wb4iojeikxnxxv24mfr36w3y/IoT_Nexus_100.mp4";
      const timestamp = new Date();
      const createAt = `${timestamp.toLocaleDateString} ${timestamp.toLocaleTimeString}`;
      await expect(
        clubcast
          .connect(addr1)
          .publishEpisode(
            clubId,
            createAt,
            episodeId2,
            title2,
            description2,
            ipfsUrl2
          )
      ).to.be.revertedWith(
        "You must be the owner of the club and the ERC721 contract"
      );
    });

    describe("Tipping content creators", function () {
      it("Should allow tipping a video", async function () {
        // First approve the tokens
        await erc20Mock.connect(owner).approve(clubcast.address, 100);

        const count = await clubcast.getEpisodeCount(clubId);
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
        const members = await clubcast.getClubMembers(clubId);
        const mappedClubTokens = clubTokens.map((token) => token.toNumber());
        expect(clubIds).to.include.members([clubId]);
        expect(mappedClubTokens).to.include.members([0]);
        expect(members).to.include.members([addr2.address]);
      });
    });

    describe("Listing Publications (Once Added Mappings)", function () {
      it("Should get the correct publication count", async function () {
        const count = await clubcast.getEpisodeCount(clubId);
        expect(count.toNumber()).to.equal(1);
      });

      it("Should list publications correctly", async function () {
        const publicationInfos = await clubcast
          .connect(addr2)
          .getClubEpisodes(clubId, addr2.address);
        expect(publicationInfos[0].id).to.equal(episodeId);
        expect(publicationInfos[0].publisher).to.equal(owner.address);
        expect(publicationInfos[0].ipfsUrl).to.equal(
          "https://ipfs.io/ipfs/bafybeifpliuby6upaubuhgrn77cqdwxe47wb4iojeikxnxxv24mfr36w3y/IoT_Nexus_100.mp4"
        );
      });
    });
  });
  describe("Multi-user Publication Filtering", function () {
    const episodeId = generateRandomId();
    const title = "episode";
    const description = "description";
    const ipfsUrl =
      "https://ipfs.io/ipfs/bafybeifpliuby6upaubuhgrn77cqdwxe47wb4iojeikxnxxv24mfr36w3y/IoT_Nexus_100.mp4";

    const episodeId2 = generateRandomId();
    const title2 = "episode2";
    const description2 = "description2";
    const ipfsUrl2 =
      "https://ipfs.io/ipfs/bafybeifpliuby6upaubuhgrn77cqdwxe47wb4iojeikxnxxv24mfr36w3y/IoT_Nexus_100.mp4";

    const episodeId3 = generateRandomId();
    const title3 = "episode3";
    const description3 = "description3";
    const ipfsUrl3 =
      "https://ipfs.io/ipfs/bafybeifpliuby6upaubuhgrn77cqdwxe47wb4iojeikxnxxv24mfr36w3y/IoT_Nexus_100.mp4";
    it("Should carry out a set of more complex minting, connecting and publishing patterns", async function () {
      const clubId = generateRandomId();
      const clubId2 = generateRandomId();
      await clubcast
        .connect(owner)
        .createClub(clubId, erc721Mock.address, governance.address);
      await clubcast
        .connect(addr2)
        .createClub(clubId2, erc721Mock2.address, governance2.address);

      await clubcast.connect(addr3).joinClub(clubId);
      await clubcast.connect(addr3).joinClub(clubId2);
      await clubcast.connect(addr4).joinClub(clubId);

      const members = await clubcast.getClubMembers(clubId);
      expect(members).to.include.members([addr3.address, addr4.address]);

      const timestamp = new Date();
      const createAt = `${timestamp.toLocaleDateString} ${timestamp.toLocaleTimeString}`;

      // Publish videos targeting specific tokens
      await clubcast.publishEpisode(
        clubId,
        episodeId,
        createAt,
        title,
        description,
        ipfsUrl
      );
      await clubcast.publishEpisode(
        clubId,
        episodeId2,
        createAt,
        title2,
        description2,
        ipfsUrl2
      );
      await clubcast
        .connect(addr2)
        .publishEpisode(
          clubId2,
          episodeId3,
          createAt,
          title3,
          description3,
          ipfsUrl3
        );
      const count = await clubcast.getEpisodeCount(clubId);
      expect(count.toNumber()).to.equal(2);

      const count2 = await clubcast.getEpisodeCount(clubId2);
      expect(count2.toNumber()).to.equal(1);

      const addr3ClubPublications = await clubcast
        .connect(addr3)
        .getClubEpisodes(clubId, addr3.address);

      const videoIds = addr3ClubPublications.map((info) => info.id);
      const ipfsUrls = addr3ClubPublications.map((info) => info.ipfsUrl);
      expect(videoIds).to.deep.equal([episodeId, episodeId2]);
      expect(ipfsUrls).to.deep.equal([ipfsUrl, ipfsUrl2]);

      const addr3Club2Publications = await clubcast
        .connect(addr3)
        .getClubEpisodes(clubId2, addr3.address);
      const videoIds2 = addr3Club2Publications.map((info) => info.id);
      expect(videoIds2).to.deep.equal([episodeId3]);

      await expect(
        clubcast.connect(addr4).getClubEpisodes(clubId2, addr4.address)
      ).to.be.rejectedWith("You are not a club member");
    });
  });
});
