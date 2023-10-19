import { getDatabase, set, ref } from "firebase/database";
import { Episode } from "@/types/club";
import app from "./index";

export const uploadEpisodeApi = async (episode: Episode) => {
  const db = getDatabase(app);
  const newClubRef = ref(db, "episodes/" + episode.id);
  await set(newClubRef, episode);
};
