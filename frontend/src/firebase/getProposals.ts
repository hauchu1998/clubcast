import { getDatabase, get, ref } from "firebase/database";
import app from "./index";
import { address } from "@/types/address";

export const fetchAllPorposals = async (governanceAddress: address) => {
  const defRef = ref(getDatabase(app), `proposals/${governanceAddress}`);
  const snapshot = await get(defRef);
  if (!snapshot.val()) return [];
  return snapshot.val();
};
