import { ethers } from "hardhat";
import { Contract } from "ethers";

async function main() {
  //   let oov3: Contract;
  //   const OOV3 = await ethers.getContractFactory("OOV3");

  //   oov3 = await OOV3.deploy();
  //   await oov3.deployed();
  const USDC_MUMBAI = "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e";
  const oov3Address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  let umaAssert: Contract;
  const UmaAssert = await ethers.getContractFactory("UmaAssert");

  umaAssert = await UmaAssert.deploy(USDC_MUMBAI, oov3Address);
  await umaAssert.deployed();
  console.log(`ERC721 Deployed to -> ${umaAssert.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
