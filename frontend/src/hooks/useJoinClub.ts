import { ClubCast__factory } from "@/typechain-types";
import { address } from "@/types/address";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

const useJoinClub = (clubId: string) => {
  const { config } = usePrepareContractWrite({
    address: (process.env.NEXT_PUBLIC_SCROLL_CLUBCAST_ADDRESS as address) || "",
    abi: ClubCast__factory.abi,
    functionName: "joinClub",
    args: [clubId as string],
  });

  const { write: writeJoinClub, data } = useContractWrite(config);
  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash as `0x${string}`,
  });

  return { writeJoinClub, isSuccess };
};

export default useJoinClub;
