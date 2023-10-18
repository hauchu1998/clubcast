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

export const useGetClub = (id: string) => {
  return useAsync(async () => {
    return fetchClub(id);
  }, [id]);
};

export const useGetUserPersonalClubs = () => {
  const { address } = useAccount();
  return useAsync(async () => {
    if (address === undefined) throw new Error("Address is undefined");
    return fetchUserPersonalClubs(address);
  }, [address]);
};

export const useGetUserSubscribedClubs = () => {
  const { address } = useAccount();
  return useAsync(async () => {
    if (address === undefined) throw new Error("Address is undefined");
    return fetchUserSubscribedClubs(address);
  }, [address]);
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
