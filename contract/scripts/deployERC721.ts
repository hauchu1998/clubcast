import { ethers } from "hardhat";
import { Contract } from "ethers";

async function main() {
  let erc721: Contract;
  const ERC721Mock = await ethers.getContractFactory("ERC721Mock");
  // Requires the tip token to be passed in during deployment

  erc721 = await ERC721Mock.deploy(
    "0xE2A794de195D92bBA0BA64e006FcC3568104245d",
    "ClubCast",
    "CBH",
    10
  );
  await erc721.deployed();
  console.log(`ERC721 Deployed to -> ${erc721.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
