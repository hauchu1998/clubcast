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
import { set } from "date-fns";

const useCreateProposal = (governanceAddress: address) => {
  const call = new Interface(ClubCastGovernor__factory.abi).encodeFunctionData(
    "doNothing"
  );
  const [title, setTitle] = useState("Topic for next week: UMA snapshot");
  const [description, setDescription] = useState(
    "UMA is an optimistic oracle that can verify any natural language statement as true on the blockchain, so contracts asking for that data can be settled. "
  );
  const [callData, setCallData] = useState(call.toString());
  const [proposalId, setProposalId] = useState("");

  const doNothing = async () => {
    setCallData(call.toString());
  };

  const { config } = usePrepareContractWrite({
    address: governanceAddress,
    abi: ClubCastGovernor__factory.abi,
    functionName: "propose",
    args: [
      [governanceAddress],
      [BigInt(0)],
      [callData as `0x${string}`],
      JSON.stringify({ title: title, description: description }),
    ],
  });
  const { data, write: writeCreateProposal } = useContractWrite(config);
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
    doNothing,
    writeCreateProposal,
    isSuccess,
  };
};

export default useCreateProposal;
