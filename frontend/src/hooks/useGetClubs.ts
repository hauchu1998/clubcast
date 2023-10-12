import { useAsync } from "react-async-hook";
import {
  fetchClubs,
  fetchUserPersonalClubs,
  fetchUserSubscribedClubs,
} from "@/firebase/getClubs";
import { useAccount } from "wagmi";

export const useGetClubs = (id: string) => {
  return useAsync(async () => {
    return fetchClubs(id);
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
