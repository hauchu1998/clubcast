import { useState } from "react";
import { useContractRead } from "wagmi";
import { useClubCastContract } from "./useClubCastContract";
import { address } from "@/types/address";
import { ClubCast__factory } from "@/typechain-types";
import { useGetClub } from "./useGetClubs";

const useGetClubMembers = (clubId: string) => {
  const [members, setMembers] = useState<address[]>([]);
  const { result: club } = useGetClub(clubId);
  useContractRead({
    enabled: club ? true : false,
    address: club?.contractAddress as address,

    onSuccess: async (data: address[]) => {
      setMembers(data);
    },
    abi: ClubCast__factory.abi,
    functionName: "getClubMembers",
    args: [clubId as string],
    chainId: club?.chainId,
    watch: true,
  });

  return members;
};

export default useGetClubMembers;
