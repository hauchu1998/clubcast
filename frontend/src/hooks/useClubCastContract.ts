import { useMemo } from "react";
import { useNetwork } from "wagmi";
import { polygonMumbai, scrollSepolia, mantleTestnet } from "viem/chains";
import { address } from "@/types/address";

export const useClubCastContract = () => {
  const { chain } = useNetwork();
  const clubCastAddress = useMemo(() => {
    if (chain?.id === scrollSepolia.id) {
      return process.env.NEXT_PUBLIC_SCROLL_CLUBCAST_ADDRESS as address;
    } else if (chain?.id === polygonMumbai.id) {
      return process.env.NEXT_PUBLIC_MUMBAI_CLUBCAST_ADDRESS as address;
    } else if (chain?.id === mantleTestnet.id) {
      return process.env.NEXT_PUBLIC_MANTLE_CLUBCAST_ADDRESS as address;
    }
  }, [chain]);
  return { chain, clubCastAddress };
};
