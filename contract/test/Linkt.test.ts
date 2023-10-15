import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { Linkt, ERC721Mock, ERC20Mock } from "../typechain-types";

describe("Linkt", function () {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addr3: SignerWithAddress;
  let addr4: SignerWithAddress;

  // Contracts
  let linkt: Linkt;
  let erc721Mock: ERC721Mock;
  let erc721Mock2: ERC721Mock;
  let erc20Mock: ERC20Mock;

  const setupAddresses = async () => {
    [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
  };

  before(async () => {
    await setupAddresses();
    await deployAllContracts();
  });

  const deployAllContracts = async () => {
    // Deploy the Linkt contract
    const Linkt = await ethers.getContractFactory("Linkt");
    // Apecoin mainnet ethereum -> 0x4d224452801aced8b2f0aebe155379bb5d594381
    // https://developers.circle.com/developer/docs/usdc-on-testnet

    // Deploy a mock ERC721 contract for testing
    const ERC721Mock = await ethers.getContractFactory("ERC721Mock");
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");

    erc721Mock = await ERC721Mock.deploy("Pepega", "PEPEGA");
    erc721Mock2 = await ERC721Mock.deploy("Pepega2", "PEPEGA2");

    erc20Mock = await ERC20Mock.deploy("Token", "TOKEN");

    await erc721Mock.deployed();
    await erc721Mock.setOwner(owner.address);

    await erc721Mock2.deployed();
    await erc721Mock2.setOwner(owner.address);

    await erc20Mock.deployed();

    linkt = await Linkt.deploy(erc20Mock.address);
    await linkt.deployed();
  };

  describe("Publishing videos", function () {
    it("should return 0 when no publications are present", async function () {
      const count = await linkt.getPublicationCount(erc721Mock.address);
      expect(count.toNumber()).to.equal(0);
    });

    it("Should publish a video and emit event", async function () {
      await expect(
        linkt.publishVideo(69, "md5Hash", erc721Mock.address, {
          audienceType: 0,
          tokenId: 0,
        })
      )
        .to.emit(linkt, "NewPublication")
        .withArgs(69, erc721Mock.address, owner.address, "md5Hash");

      const count = await linkt.getPublicationCount(erc721Mock.address);
      expect(count.toNumber()).to.equal(1);
    });

    it("Should fail if not the owner of the ERC721 contract", async function () {
      await expect(
        linkt.connect(addr1).publishVideo(2, "md5Hash2", erc721Mock.address, {
          audienceType: 0,
          tokenId: 0,
        })
      ).to.be.revertedWith("You must be the owner of the ERC721 contract");
    });
  });

  describe("Tipping content creators", function () {
    it("Should allow tipping a video", async function () {
      // First approve the tokens
      await erc20Mock.connect(owner).approve(linkt.address, 100);

      const count = await linkt.getPublicationCount(erc721Mock.address);
      // Then tip
      await expect(linkt.connect(owner).tipContentCreator(50, erc721Mock.address))
        .to.emit(linkt, "Tipped")
        .withArgs(owner.address, erc721Mock.address, 50);

      // Validate tip was saved
      const tipAmount = await linkt.tips(erc721Mock.address);
      expect(tipAmount).to.equal(50);
    });

    it("Should allow withdrawing tips", async function () {
      // Withdraw tips
      await expect(linkt.connect(owner).withdrawTips(erc721Mock.address)).to.emit(linkt, "Withdrawn").withArgs(owner.address, erc721Mock.address, 50);

      // Validate tips are now 0
      const tipAmount = await linkt.tips(owner.address);
      expect(tipAmount).to.equal(0);
    });
  });

  describe("User -> Token mappings", function () {
    it("Should add user token mappings", async function () {
      // Mint the things we need for this test
      await erc721Mock.connect(owner).mint(owner.address, 1);
      await erc721Mock2.connect(owner).mint(owner.address, 1);

      await expect(
        linkt.connect(owner).addUserTokenMapping(
          [erc721Mock.address, erc721Mock2.address], // Users want to map to these contracts
          [1, 1] // They are proposing they have these tokens - index relates to contract 1:1
        )
      ).to.not.be.reverted;

      // Fetch the mapped tokens
      const [mappedAddresses, mappedTokenIds] = await linkt.getUserTokenMapping(owner.address);
      const mappedTokenIdsAsNumbers = mappedTokenIds.map((id) => id.toNumber());

      // Assert the correctness of the mapped addresses and token IDs
      expect(mappedAddresses).to.include.members([erc721Mock.address, erc721Mock2.address]);
      expect(mappedTokenIdsAsNumbers).to.include.members([1, 1]);
    });

    it("Should revert if array lengths mismatch", async function () {
      await expect(
        linkt.connect(owner).addUserTokenMapping(
          [erc721Mock.address], // Only one address
          [1, 2] // But two token IDs
        )
      ).to.be.revertedWith("Arrays should have the same length");
    });

    it("Should revert if not the owner of the token", async function () {
      await expect(
        linkt.connect(addr1).addUserTokenMapping(
          [erc721Mock.address], // One address
          [1] // The token ID
        )
      ).to.be.revertedWith("Caller must be the owner of the token");
    });

    it("Should overwrite existing mappings", async function () {
      // First mapping
      await expect(linkt.connect(owner).addUserTokenMapping([erc721Mock.address], [1])).to.not.be.reverted;

      // To call below the owner would need to own token 2 - so mint it.
      await erc721Mock.connect(owner).mint(owner.address, 2);

      // Overwrite with a new mapping
      await expect(linkt.connect(owner).addUserTokenMapping([erc721Mock.address], [2])).to.not.be.reverted;

      const [mappedAddresses, mappedTokenIds] = await linkt.getUserTokenMapping(owner.address);
      const mappedTokenIdsAsNumbers = mappedTokenIds.map((id) => id.toNumber());

      expect(mappedAddresses).to.include.members([erc721Mock.address]);
      expect(mappedTokenIdsAsNumbers).to.include.members([2]); // Should be updated to 2
    });

    describe("Listing Publications (Once Added Mappings)", function () {
      it("Should get the correct publication count", async function () {
        const count = await linkt.getPublicationCount(erc721Mock.address);
        expect(count.toNumber()).to.equal(1);
      });

      it("Should list publications correctly", async function () {
        const publicationInfos = await linkt.connect(owner).listPublications(erc721Mock.address, owner.address);

        expect(publicationInfos[0].videoId).to.equal(69);
        expect(publicationInfos[0].publisher).to.equal(owner.address);
        expect(publicationInfos[0].md5Hash).to.equal("md5Hash");
      });
    });
  });

  describe("Multi-user Publication Filtering", function () {
    it("Should carry out a set of more complex minting, connecting and publishing patterns", async function () {
      // Mint tokens for owner and addr1
      await erc721Mock.connect(owner).mint(owner.address, 3);
      await erc721Mock.connect(owner).mint(addr1.address, 4);

      // Add user token mappings
      await linkt.connect(owner).addUserTokenMapping([erc721Mock.address], [1]);
      await linkt.connect(addr1).addUserTokenMapping([erc721Mock.address], [4]);

      // Publish videos targeting specific tokens
      await linkt.publishVideo(
        3,
        "md5Hash2",
        erc721Mock.address,
        { audienceType: 3, tokenId: 1 } // For token 1
      );
      const count = await linkt.getPublicationCount(erc721Mock.address);
      expect(count.toNumber()).to.equal(2);

      await linkt.publishVideo(
        4,
        "md5Hash3",
        erc721Mock.address,
        { audienceType: 3, tokenId: 2 } // For token 2
      );

      const countAfterNextPublish = await linkt.getPublicationCount(erc721Mock.address);
      expect(countAfterNextPublish.toNumber()).to.equal(3);

      await linkt.publishVideo(
        5,
        "md5Hash0",
        erc721Mock.address,
        { audienceType: 1, tokenId: 0 } // For ALL holders (audience 1) of the collection (token 0)
      );

      const countAfterAllPublish = await linkt.getPublicationCount(erc721Mock.address);
      expect(countAfterAllPublish.toNumber()).to.equal(4);

      const publicationInfosOwner = await linkt.listPublications(erc721Mock.address, owner.address);

      const videoIdsOwner = publicationInfosOwner.map((info) => info.videoId.toNumber());
      const publishersOwner = publicationInfosOwner.map((info) => info.publisher);
      const md5HashesOwner = publicationInfosOwner.map((info) => info.md5Hash);

      expect(videoIdsOwner).to.deep.equal([69, 3, 5]);
      expect(publishersOwner).to.deep.equal([owner.address, owner.address, owner.address]);
      expect(md5HashesOwner).to.deep.equal(["md5Hash", "md5Hash2", "md5Hash0"]);

      // // Call listPublications from addr1's perspective
      const publicationInfosAddr1 = await linkt.connect(addr1).listPublications(erc721Mock.address, addr1.address);

      const videoIdsAddr1 = publicationInfosAddr1.map((info) => info.videoId.toNumber());
      const publishersAddr1 = publicationInfosAddr1.map((info) => info.publisher);
      const md5HashesAddr1 = publicationInfosAddr1.map((info) => info.md5Hash);

      expect(videoIdsAddr1).to.deep.equal([69, 5]); // Only the content for user1 on erc721Mock should be shown
      expect(publishersAddr1).to.deep.equal([owner.address, owner.address]);
      expect(md5HashesAddr1).to.deep.equal(["md5Hash", "md5Hash0"]);

      // There are tokens for this contract but owner address has not added mappings for this
      const publicationInfosAddr2 = await linkt.connect(owner).listPublications(erc721Mock2.address, owner.address);

      const videoIdsAddr2 = publicationInfosAddr2.map((info) => info.videoId.toNumber());
      const publishersAddr2 = publicationInfosAddr2.map((info) => info.publisher);
      const md5HashesAddr2 = publicationInfosAddr2.map((info) => info.md5Hash);

      expect(videoIdsAddr2).to.deep.equal([]); // Only the content for user1 on erc721Mock should be shown
      expect(publishersAddr2).to.deep.equal([]);
      expect(md5HashesAddr2).to.deep.equal([]);

      await erc721Mock2.connect(owner).transferOwnership(addr1.address);
      expect(await erc721Mock2.connect(owner).owner()).to.equal(addr1.address);
      console.log(`addr1 is now the owner of erc721Mock2`);

      await linkt.connect(addr1).publishVideo(
        1,
        "pepega-hash",
        erc721Mock2.address,
        { audienceType: 1, tokenId: 1 } // For any holders of this collection
      );

      // Mint a few tokens
      for (const iterator of [2, 3, 4, 5, 6]) {
        await erc721Mock2.connect(addr2).mint(addr2.address, iterator);
      }

      await linkt.connect(addr2).addUserTokenMapping([erc721Mock2.address], [6]);

      const publicationInfosAddr3 = await linkt.connect(addr2).listPublications(erc721Mock2.address, addr2.address);

      const videoIdsAddr3 = publicationInfosAddr3.map((info) => info.videoId.toNumber());
      const publishersAddr3 = publicationInfosAddr3.map((info) => info.publisher);
      const md5HashesAddr3 = publicationInfosAddr3.map((info) => info.md5Hash);

      expect(videoIdsAddr3).to.deep.equal([1]); // Only the content for user1 on erc721Mock should be shown
      expect(publishersAddr3).to.deep.equal([addr1.address]);
      expect(md5HashesAddr3).to.deep.equal(["pepega-hash"]);

      const publicationInfosAddr4 = await linkt.connect(addr3).listPublications(erc721Mock2.address, addr3.address);

      const videoIdsAddr4 = publicationInfosAddr4.map((info) => info.videoId.toNumber());
      expect(videoIdsAddr4).to.deep.equal([]); // addr3 doesnt hold any tokens so should only see audience 1 content

      await erc721Mock2.connect(addr3).mint(addr3.address, 7);

      await linkt.connect(addr3).addUserTokenMapping([erc721Mock2.address], [7]);

      const publicationInfosAddr5 = await linkt.connect(addr3).listPublications(erc721Mock2.address, addr3.address);

      const videoIdsAddr5 = publicationInfosAddr5.map((info) => info.videoId.toNumber());
      expect(videoIdsAddr5).to.deep.equal([1]); // addr3 just minted and conntected token 7

      // addr4 doesnt own any tokens and has nothing connected
      const publicationInfosAddr6 = await linkt.connect(addr4).listPublications(erc721Mock.address, addr4.address);

      const videoIdsAddr6 = publicationInfosAddr6.map((info) => info.videoId.toNumber());

      expect(videoIdsAddr6).to.deep.equal([69]); //  just minted and conntected token 7
    });
  });
});
