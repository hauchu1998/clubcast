import { useMemo } from "react";
import { polygonMumbai, scrollSepolia, mantleTestnet } from "viem/chains";
import { address } from "@/types/address";
import { useGetClub } from "./useGetClubs";
import { useNetwork } from "wagmi";

export const useClubCastContract = () => {
  const { chain } = useNetwork();

  const clubCastAddress = useMemo(() => {
    if (chain?.id === scrollSepolia.id) {
      return process.env.NEXT_PUBLIC_SCROLL_CLUBCAST_ADDRESS as address;
    } else if (chain?.id === polygonMumbai.id) {
      return process.env.NEXT_PUBLIC_MUMBAI_CLUBCAST_ADDRESS as address;
    } else if (chain?.id === mantleTestnet.id) {
      return process.env.NEXT_PUBLIC_MANTLE_CLUBCAST_ADDRESS as address;
    } else {
      return process.env.NEXT_PUBLIC_SCROLL_CLUBCAST_ADDRESS as address;
    }
  }, [chain]);
  return { chain, clubCastAddress };
};
