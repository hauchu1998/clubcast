import { ethers } from "hardhat";
import { Contract } from "ethers";

async function main() {
  let governor: Contract;
  const Governor = await ethers.getContractFactory("ClubCastGovernor");
  // Requires the tip token to be passed in during deployment

  governor = await Governor.deploy(
    "0xA6c5bD390E92616CA1efE23ABA568e69C4B44FEB",
    0,
    4
  );
  await governor.deployed();
  console.log(`Governor Deployed to -> ${governor.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
