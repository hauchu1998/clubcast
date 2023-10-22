import { ClubCastGovernor__factory } from "@/typechain-types";
import { address } from "@/types/address";
import { useState } from "react";
import { ethers } from "ethers";
import { Interface } from "ethers/lib/utils";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

const useCreateProposal = (governanceAddress: address) => {
  const callDoNothing = new Interface(
    ClubCastGovernor__factory.abi
  ).encodeFunctionData("doNothing");
  const callRefund = new Interface(
    ClubCastGovernor__factory.abi
  ).encodeFunctionData("askForRefund");
  const [title, setTitle] = useState("Topic for next week: UMA snapshot");
  const [description, setDescription] = useState(
    "UMA is an optimistic oracle that can verify any natural language statement as true on the blockchain, so contracts asking for that data can be settled. "
  );
  const [callData, setCallData] = useState("");
  const [proposalId, setProposalId] = useState("");

  const askForRefund = async () => {
    setCallData(callRefund);
  };

  const { data, write: writeCreateProposal } = useContractWrite({
    address: governanceAddress,
    abi: ClubCastGovernor__factory.abi,
    functionName: "propose",
    args: [
      [governanceAddress],
      [BigInt(0)],
      [
        callData !== undefined
          ? (callData as `0x${string}`)
          : (callDoNothing as `0x${string}`),
      ],
      JSON.stringify({ title: title, description: description }),
    ],
  });
  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash as `0x${string}`,
  });

  return {
    proposalId,
    title,
    setTitle,
    description,
    setDescription,
    callData,
    setCallData,
    askForRefund,
    writeCreateProposal,
    isSuccess,
  };
};

export default useCreateProposal;
