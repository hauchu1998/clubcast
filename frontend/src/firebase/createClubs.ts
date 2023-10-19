import { getDatabase, set, ref } from "firebase/database";
import { Club } from "@/types/club";
import { queryClient } from "@/pages/_app";
import app from "./index";

export const createClubApi = async (club: Club) => {
  const db = getDatabase(app);
  const newClubRef = ref(db, "clubs/" + club.id);
  const res = await set(newClubRef, club);

  const owner = club.owner;

  await queryClient.invalidateQueries({
    queryKey: [owner, "personal", "clubs"],
  });

  await queryClient.invalidateQueries({
    queryKey: ["all", "clubs"],
  });

  return res;
};
