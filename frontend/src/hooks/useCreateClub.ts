import { ClubCast__factory } from "@/typechain-types";
import { address } from "@/types/address";
import { useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useClubCastContract } from "./useClubCastContract";

const useCreateClub = (clubId: string) => {
  const [erc721Address, setErc721Address] = useState("");
  const [governanceAddress, setGovernanceAddress] = useState("");
  const { clubCastAddress } = useClubCastContract();

  const { data, write: writeCreateClub } = useContractWrite({
    address: (clubCastAddress as address) || "",
    abi: ClubCast__factory.abi,
    functionName: "createClub",
    args: [clubId, erc721Address as address, governanceAddress as address],
  });
  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash as `0x${string}`,
  });
  return {
    erc721Address,
    setErc721Address,
    governanceAddress,
    setGovernanceAddress,
    writeCreateClub,
    isSuccess,
  };
};

export default useCreateClub;
