import { getDatabase, get, ref } from "firebase/database";
import app from "./index";

export const fetchEpisode = async (id: string) => {
  const defRef = ref(getDatabase(app), `club/${id}`);
  const snapshot = await get(defRef);
  return snapshot.val();
};
