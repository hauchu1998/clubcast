import { ethers } from "hardhat";
import { Contract } from "ethers";

async function main() {
  let clubcast: Contract;
  const ClubCast = await ethers.getContractFactory("ClubCast");
  // Requires the tip token to be passed in during deployment

  const USDT_SCROLL_SEPOLIA = "0xffd2ece82f7959ae184d10fe17865d27b4f0fb94";
  clubcast = await ClubCast.deploy(USDT_SCROLL_SEPOLIA);
  await clubcast.deployed();
  console.log(`Clubcast Deployed to -> ${clubcast.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
