import { useQuery } from "@tanstack/react-query";
import { getDatabase, ref, get } from "firebase/database";
import { fetchAllClubs } from "@/firebase/getClubs";
import app from "@/firebase/index";

export const useGetAllClubs = () => {
  const defRef = ref(getDatabase(app), "clubs");
  const enabled = defRef !== undefined;
  return useQuery({
    enabled,
    queryKey: ["all", "clubs"],
    queryFn: fetchAllClubs,
  });
};
