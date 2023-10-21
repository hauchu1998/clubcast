import { ethers } from "hardhat";
import { Contract } from "ethers";

async function main() {
  let clubcast: Contract;
  const ClubCast = await ethers.getContractFactory("ClubCast");
  // Requires the tip token to be passed in during deployment

  // const USDT_SCROLL_SEPOLIA = "0xffd2ece82f7959ae184d10fe17865d27b4f0fb94";
  // const USDC_MUMBAI = "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e";
  const USDC_MANTLE = "0xa11be02594aef2ab383703d4ac7c7ad01767b30e";
  clubcast = await ClubCast.deploy(USDC_MANTLE);
  await clubcast.deployed();
  console.log(`Clubcast Deployed to -> ${clubcast.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
