import { Episode } from "@/types/club";
import { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { useClubCastContract } from "./useClubCastContract";
import { ClubCast__factory } from "@/typechain-types";
import { address } from "@/types/address";
import { useGetClub } from "./useGetClubs";

const useGetClubEpisodes = (clubId: string) => {
  const { address: user } = useAccount();
  const { result: club } = useGetClub(clubId);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const { clubCastAddress } = useClubCastContract();

  useContractRead({
    address: clubCastAddress as `0x${string}`,
    enabled: clubCastAddress ? true : false,
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
