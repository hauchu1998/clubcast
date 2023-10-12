import { useQuery } from "@tanstack/react-query";
import { getDatabase, ref, get } from "firebase/database";
import { fetchAllClubs } from "@/firebase/getClubs";
import app from "@/firebase/index";
import { useAccount } from "wagmi";

export const useGetAllClubs = () => {
  const { address } = useAccount();
  const defRef = ref(getDatabase(app), "clubs");
  const enabled = defRef !== undefined && address !== undefined;
  return useQuery({
    enabled,
    queryKey: [, "clubs"],
    queryFn: fetchAllClubs,
  });
};
