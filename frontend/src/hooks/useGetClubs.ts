import { useAsync } from "react-async-hook";
import {
  fetchClub,
  fetchAllClubs,
  fetchUserPersonalClubs,
  fetchUserSubscribedClubs,
} from "@/firebase/getClubs";
import { useAccount } from "wagmi";
import { getDatabase, ref } from "firebase/database";
import app from "@/firebase/index";
import { useQuery } from "@tanstack/react-query";
import { Club } from "@/types/club";

export const useGetClub = (id: string) => {
  return useAsync(async () => {
    return fetchClub(id);
  }, [id]);
};

export const useGetUserPersonalClubs = () => {
  const { address } = useAccount();
  const defRef = ref(getDatabase(app), "clubs");
  const enabled = defRef !== undefined && address !== undefined;
  return useQuery({
    enabled,
    queryKey: [address, "personal", "clubs"],
    queryFn: async () => fetchUserPersonalClubs(address as string),
  });
};

export const useGetUserSubscribedClubs = () => {
  const { address } = useAccount();
  const defRef = ref(getDatabase(app), `subscriptions/${address}`);
  const enabled = defRef !== undefined && address !== undefined;
  return useQuery({
    enabled,
    queryKey: [address, "subscribed", "clubs"],
    queryFn: async () => {
      const clubIds = await fetchUserSubscribedClubs(address as string);
      if (!clubIds) return [] as Club[];
      const clubs: Club[] = await Promise.all(
        clubIds.map(async (id: string) => {
          return fetchClub(id);
        })
      );
      return clubs;
    },
  });
};

export const useGetAllClubs = () => {
  const defRef = ref(getDatabase(app), "clubs");
  const enabled = defRef !== undefined;
  return useQuery({
    enabled,
    queryKey: ["all", "clubs"],
    queryFn: fetchAllClubs,
  });
};
