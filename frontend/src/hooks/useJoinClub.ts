import { ClubCast__factory } from "@/typechain-types";
import { address } from "@/types/address";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useClubCastContract } from "./useClubCastContract";

const useJoinClub = (clubId: string) => {
  const { chain, clubCastAddress } = useClubCastContract();

  const { write: writeJoinClub, data } = useContractWrite({
    address: (clubCastAddress as address) || "",
    abi: ClubCast__factory.abi,
    functionName: "joinClub",
    args: [clubId as string],
    chainId: chain?.id,
  });
  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash as `0x${string}`,
  });

  return { writeJoinClub, isSuccess };
};

export default useJoinClub;
