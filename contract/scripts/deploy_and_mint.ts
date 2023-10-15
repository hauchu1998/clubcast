import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function main() {
  let clubcast: Contract;
  let simpleErc721: Contract;
  let owner: SignerWithAddress;

  [owner] = await ethers.getSigners();

  const ClubCast = await ethers.getContractFactory("ClubCast");
  const SimpleErc721 = await ethers.getContractFactory("ERC721Mock");
  // Requires the tip token to be passed in during deployment

  const tippingToken = ethers.constants.AddressZero;
  simpleErc721 = await SimpleErc721.deploy("Faux Pass", "FAUXP");
  clubcast = await ClubCast.deploy(tippingToken);

  await simpleErc721.deployed();
  await clubcast.deployed();

  console.log(`SimpleErc721 Deployed to -> ${simpleErc721.address}`);
  console.log(`ClubCast Deployed to -> ${clubcast.address}`);

  const sWallet = "0x7baB11bECD925413eae49b9278fae3476aD17EDd";
  const cWallet = "0x9325ED3fe17893b8eA8B8507427A8c07f14d0E03";

  // Scroll Testnet
  // SimpleErc721 Deployed to -> 0x39A02239e680C35f4867BDc86a7771D74001CfBe
  // Linkt Deployed to -> 0xC8956c09455D6c499E78137BAA3b43e81FC20326

  await simpleErc721.mint(sWallet, 1);
  await simpleErc721.mint(cWallet, 1);
  console.log(`Minted a Token each to S/C`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
