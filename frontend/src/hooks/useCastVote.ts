import { ClubCastGovernor__factory } from "@/typechain-types";
import { address } from "@/types/address";
import { useState } from "react";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { Vote } from "@/types/governance";

const useCastVote = (governanceAddress: address, proposalId: string) => {
  const [vote, setVote] = useState<Vote>();

  const { data, write: writeCastVote } = useContractWrite({
    address: governanceAddress || "",
    abi: ClubCastGovernor__factory.abi,
    functionName: "castVote",
    args: [BigInt(proposalId), Number(vote)],
  });
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
