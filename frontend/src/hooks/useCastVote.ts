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
import { Vote } from "@/types/club";

const useCastVote = (governanceAddress: address, proposalId: string) => {
  const [vote, setVote] = useState<Vote>(Vote.Abstain);
  const { config } = usePrepareContractWrite({
    address: governanceAddress || "",
    enabled:
      governanceAddress !== undefined &&
      proposalId !== undefined &&
      vote !== undefined,
    abi: ClubCastGovernor__factory.abi,
    functionName: "castVote",
    args: [BigInt(proposalId), vote],
  });
  const { data, write: writeCastVote } = useContractWrite(config);
  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash as `0x${string}`,
  });

  return {
    vote,
    setVote,
    writeCastVote,
    isSuccess,
  };
};

export default useCastVote;
