import { useMemo } from "react";
import { useNetwork } from "wagmi";
import { chains } from "@/constants/networks";
import { scrollSepolia } from "viem/chains";

export const useClubCastContract = () => {
  const { chain } = useNetwork();
  const clubCastAddress = useMemo(() => {
    if (chain?.id === scrollSepolia.id) {
      return process.env.NEXT_PUBLIC_SCROLL_CLUBCAST_ADDRESS;
    }
  }, [chain]);
  return { clubCastAddress };
};
