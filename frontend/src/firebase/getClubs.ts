import { getDatabase, get, ref } from "firebase/database";
import app from "./index";
import { Club } from "@/types/club";

export const fetchAllClubs = async () => {
  const defRef = ref(getDatabase(app), "clubs");
  const snapshot = await get(defRef);
  const res = snapshot.val();
  if (!res) return [];
  return Object.keys(res).map((key) => res[key]);
};

export const fetchClub = async (id: string) => {
  const defRef = ref(getDatabase(app), `clubs/${id}`);
  const snapshot = await get(defRef);
  return snapshot.val() as Club;
};

export const fetchUserPersonalClubs = async (address: string) => {
  const defRef = ref(getDatabase(app), "clubs");
  const snapshot = await get(defRef);
  const res = snapshot.val();
  if (!res) return [];
  return Object.keys(res)
    .map((key) => res[key])
    .filter((club) => club.owner === address);
};

export const fetchUserSubscribedClubs = async (address: string) => {
  const defRef = ref(getDatabase(app), `subscriptions/${address}`);
  const snapshot = await get(defRef);
  const subscriptionStr = snapshot.val();
  return subscriptionStr;
};
