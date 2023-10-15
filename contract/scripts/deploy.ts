import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function main() {
  let clubcast: Contract;
  let owner: SignerWithAddress;

  [owner] = await ethers.getSigners();

  const ClubCast = await ethers.getContractFactory("ClubCast");
  // Requires the tip token to be passed in during deployment

  const USDC = "0xa0d71b9877f44c744546d649147e3f1e70a93760";
  clubcast = await ClubCast.deploy(USDC);
  await clubcast.deployed();
  console.log(`Clubcast Deployed to -> ${clubcast.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
