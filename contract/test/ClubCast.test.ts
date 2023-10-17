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

    erc721Mock2 = await ERC721Mock.deploy(owner.address, "club", "CBH", 10);
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
      ).to.be.revertedWith("You must be the owner of the club");
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
    // });

    // describe("Multi-user Publication Filtering", function () {
    //   it("Should carry out a set of more complex minting, connecting and publishing patterns", async function () {
    //     // Mint tokens for owner and addr1
    //     await erc721Mock.connect(owner).mint(owner.address, 3);
    //     await erc721Mock.connect(owner).mint(addr1.address, 4);

    //     // Add user token mappings
    //     await clubcast
    //       .connect(owner)
    //       .addUserTokenMapping([erc721Mock.address], [1]);
    //     await clubcast
    //       .connect(addr1)
    //       .addUserTokenMapping([erc721Mock.address], [4]);

    //     // Publish videos targeting specific tokens
    //     await clubcast.publishVideo(
    //       3,
    //       "md5Hash2",
    //       erc721Mock.address,
    //       { audienceType: 3, tokenId: 1 } // For token 1
    //     );
    //     const count = await clubcast.getPublicationCount(erc721Mock.address);
    //     expect(count.toNumber()).to.equal(2);

    //     await clubcast.publishVideo(
    //       4,
    //       "md5Hash3",
    //       erc721Mock.address,
    //       { audienceType: 3, tokenId: 2 } // For token 2
    //     );

    //     const countAfterNextPublish = await clubcast.getPublicationCount(
    //       erc721Mock.address
    //     );
    //     expect(countAfterNextPublish.toNumber()).to.equal(3);

    //     await clubcast.publishVideo(
    //       5,
    //       "md5Hash0",
    //       erc721Mock.address,
    //       { audienceType: 1, tokenId: 0 } // For ALL holders (audience 1) of the collection (token 0)
    //     );

    //     const countAfterAllPublish = await clubcast.getPublicationCount(
    //       erc721Mock.address
    //     );
    //     expect(countAfterAllPublish.toNumber()).to.equal(4);

    //     const publicationInfosOwner = await clubcast.listPublications(
    //       erc721Mock.address,
    //       owner.address
    //     );

    //     const videoIdsOwner = publicationInfosOwner.map((info) =>
    //       info.videoId.toNumber()
    //     );
    //     const publishersOwner = publicationInfosOwner.map(
    //       (info) => info.publisher
    //     );
    //     const md5HashesOwner = publicationInfosOwner.map((info) => info.md5Hash);

    //     expect(videoIdsOwner).to.deep.equal([69, 3, 5]);
    //     expect(publishersOwner).to.deep.equal([
    //       owner.address,
    //       owner.address,
    //       owner.address,
    //     ]);
    //     expect(md5HashesOwner).to.deep.equal(["md5Hash", "md5Hash2", "md5Hash0"]);

    //     // // Call listPublications from addr1's perspective
    //     const publicationInfosAddr1 = await clubcast
    //       .connect(addr1)
    //       .listPublications(erc721Mock.address, addr1.address);

    //     const videoIdsAddr1 = publicationInfosAddr1.map((info) =>
    //       info.videoId.toNumber()
    //     );
    //     const publishersAddr1 = publicationInfosAddr1.map(
    //       (info) => info.publisher
    //     );
    //     const md5HashesAddr1 = publicationInfosAddr1.map((info) => info.md5Hash);

    //     expect(videoIdsAddr1).to.deep.equal([69, 5]); // Only the content for user1 on erc721Mock should be shown
    //     expect(publishersAddr1).to.deep.equal([owner.address, owner.address]);
    //     expect(md5HashesAddr1).to.deep.equal(["md5Hash", "md5Hash0"]);

    //     // There are tokens for this contract but owner address has not added mappings for this
    //     const publicationInfosAddr2 = await clubcast
    //       .connect(owner)
    //       .listPublications(erc721Mock2.address, owner.address);

    //     const videoIdsAddr2 = publicationInfosAddr2.map((info) =>
    //       info.videoId.toNumber()
    //     );
    //     const publishersAddr2 = publicationInfosAddr2.map(
    //       (info) => info.publisher
    //     );
    //     const md5HashesAddr2 = publicationInfosAddr2.map((info) => info.md5Hash);

    //     expect(videoIdsAddr2).to.deep.equal([]); // Only the content for user1 on erc721Mock should be shown
    //     expect(publishersAddr2).to.deep.equal([]);
    //     expect(md5HashesAddr2).to.deep.equal([]);

    //     await erc721Mock2.connect(owner).transferOwnership(addr1.address);
    //     expect(await erc721Mock2.connect(owner).owner()).to.equal(addr1.address);
    //     console.log(`addr1 is now the owner of erc721Mock2`);

    //     await clubcast.connect(addr1).publishVideo(
    //       1,
    //       "pepega-hash",
    //       erc721Mock2.address,
    //       { audienceType: 1, tokenId: 1 } // For any holders of this collection
    //     );

    //     // Mint a few tokens
    //     for (const iterator of [2, 3, 4, 5, 6]) {
    //       await erc721Mock2.connect(addr2).mint(addr2.address, iterator);
    //     }

    //     await clubcast
    //       .connect(addr2)
    //       .addUserTokenMapping([erc721Mock2.address], [6]);

    //     const publicationInfosAddr3 = await clubcast
    //       .connect(addr2)
    //       .listPublications(erc721Mock2.address, addr2.address);

    //     const videoIdsAddr3 = publicationInfosAddr3.map((info) =>
    //       info.videoId.toNumber()
    //     );
    //     const publishersAddr3 = publicationInfosAddr3.map(
    //       (info) => info.publisher
    //     );
    //     const md5HashesAddr3 = publicationInfosAddr3.map((info) => info.md5Hash);

    //     expect(videoIdsAddr3).to.deep.equal([1]); // Only the content for user1 on erc721Mock should be shown
    //     expect(publishersAddr3).to.deep.equal([addr1.address]);
    //     expect(md5HashesAddr3).to.deep.equal(["pepega-hash"]);

    //     const publicationInfosAddr4 = await clubcast
    //       .connect(addr3)
    //       .listPublications(erc721Mock2.address, addr3.address);

    //     const videoIdsAddr4 = publicationInfosAddr4.map((info) =>
    //       info.videoId.toNumber()
    //     );
    //     expect(videoIdsAddr4).to.deep.equal([]); // addr3 doesnt hold any tokens so should only see audience 1 content

    //     await erc721Mock2.connect(addr3).mint(addr3.address, 7);

    //     await clubcast
    //       .connect(addr3)
    //       .addUserTokenMapping([erc721Mock2.address], [7]);

    //     const publicationInfosAddr5 = await clubcast
    //       .connect(addr3)
    //       .listPublications(erc721Mock2.address, addr3.address);

    //     const videoIdsAddr5 = publicationInfosAddr5.map((info) =>
    //       info.videoId.toNumber()
    //     );
    //     expect(videoIdsAddr5).to.deep.equal([1]); // addr3 just minted and conntected token 7

    //     // addr4 doesnt own any tokens and has nothing connected
    //     const publicationInfosAddr6 = await clubcast
    //       .connect(addr4)
    //       .listPublications(erc721Mock.address, addr4.address);

    //     const videoIdsAddr6 = publicationInfosAddr6.map((info) =>
    //       info.videoId.toNumber()
    //     );

    //     expect(videoIdsAddr6).to.deep.equal([69]); //  just minted and conntected token 7
    //   });
  });
});
