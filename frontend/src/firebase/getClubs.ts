import { getDatabase, get, ref } from "firebase/database";
import app from "./index";

export const fetchAllClubs = async () => {
  const defRef = ref(getDatabase(app), "club");
  const snapshot = await get(defRef);
  const res = snapshot.val();
  return Object.keys(res).map((key) => res[key]);
};

export const fetchClubs = async (id: string) => {
  const defRef = ref(getDatabase(app), `club/${id}`);
  const snapshot = await get(defRef);
  return snapshot.val();
};

export const fetchUserPersonalClubs = async (address: string) => {
  const defRef = ref(getDatabase(app), "club");
  const snapshot = await get(defRef);
  const res = snapshot.val();
  return Object.keys(res)
    .map((key) => res[key])
    .filter((club) => club.owner === address);
};

export const fetchUserSubscribedClubs = async (address: string) => {
  const defRef = ref(getDatabase(app), `users/${address}/subscriptions`);
  const snapshot = await get(defRef);
  const subscriptionStr = snapshot.val();
  return JSON.parse(subscriptionStr);
};