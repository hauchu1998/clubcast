import { ClubCastGovernor__factory } from "@/typechain-types";
import { address } from "@/types/address";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useBlockNumber, useNetwork } from "wagmi";
import { getContract } from "viem";
import { createPublicClient, http } from "viem";
import { ethers } from "ethers";
import useEtherWalletClient from "./useEtherWalletClient";
import { fetchAllPorposals } from "@/firebase/getProposals";
import { getDatabase, ref } from "firebase/database";
import app from "@/firebase";

const useGetAllProposals = (governanceAddress: address) => {
  const defRef = ref(getDatabase(app), `proposals/${governanceAddress}`);
  const enabled = governanceAddress !== undefined && defRef !== undefined;
  return useQuery({
    enabled,
    queryKey: [governanceAddress, "all", "proposals"],
    queryFn: async () => {
      const proposals = await fetchAllPorposals(governanceAddress);
      return proposals;
    },
  });
};

// const useGetAllProposals = (governanceAddress: address) => {
//   const [allProposal, setAllProposal] = useState();
//   const { result: signer } = useEtherWalletClient();
//   const startBlockNumber =
//     Number(process.env.NEXT_PUBLIC_START_BLOCK_NUMBER) || 0;
//   const { data: blockNumber } = useBlockNumber();

//   const { chain } = useNetwork();
//   const client = createPublicClient({
//     chain,
//     transport: http(),
//   });
//   const contract = getContract({
//     address: governanceAddress,
//     abi: ClubCastGovernor__factory.abi,
//     publicClient: client,
//   });

//   //   const contract = new ethers.Contract(
//   //     governanceAddress,
//   //     ClubCastGovernor__factory.abi,
//   //     signer,
//   //   );
//   const enabled =
//     contract !== undefined && chain !== undefined && blockNumber !== undefined;
//   return useQuery({
//     enabled,
//     queryKey: [governanceAddress, "all proposals"],
//     queryFn: async () => {
//       if (!enabled) throw new Error("not enabled");

//       const promises: Promise<any>[] = [];
//       const maxBlockNumber = Number(blockNumber);
//       for (let i = startBlockNumber; i < maxBlockNumber; i += 2000) {
//         const endBlock = i + 2000 > maxBlockNumber ? maxBlockNumber : i + 2000;
//         const promise = contract.getEvents.ProposalCreated({
//           fromBlock: BigInt(i),
//           toBlock: BigInt(endBlock),
//         });
//         promises.push(promise);
//       }

//       const logs: any[] = [];
//       await Promise.all(
//         promises.map(async (promise) => {
//           const log = await promise;
//           logs.push(...log);
//         })
//       );

//       console.log(logs);
//       return logs;
//     },
//   });
// };

export default useGetAllProposals;
