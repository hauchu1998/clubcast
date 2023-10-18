import { useAsync } from "react-async-hook";
import { fetchEpisode } from "@/firebase/getEpisode";

export const useGetEpisode = (id: string) => {
  return useAsync(async () => {
    return fetchEpisode(id);
  }, [id]);
};
