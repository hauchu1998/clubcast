import { Episode } from "@/types/club";
import { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { ClubCast__factory } from "@/typechain-types";
import { address } from "@/types/address";
import { useGetClub } from "./useGetClubs";

const useGetClubEpisodes = (clubId: string) => {
  const { address: user } = useAccount();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const { result: club } = useGetClub(clubId);

  useContractRead({
    address: club?.contractAddress as `0x${string}`,
    enabled: club ? true : false,
    onSuccess: async (data: Episode[]) => {
      setEpisodes(data);
    },
    abi: ClubCast__factory.abi,
    functionName: "getClubEpisodes",
    chainId: club?.chainId,
    args: [clubId, user as address],
  });

  return { episodes, setEpisodes };
};
export default useGetClubEpisodes;
