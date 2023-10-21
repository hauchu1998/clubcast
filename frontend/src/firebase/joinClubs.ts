import { getDatabase, set, ref } from "firebase/database";
import { queryClient } from "@/pages/_app";
import app from "./index";
import { fetchUserSubscribedClubs } from "./getClubs";

export const joinClubApi = async (address: string, clubId: string) => {
  const db = getDatabase(app);
  const subscriptions = await fetchUserSubscribedClubs(address);
  const newSubsciptionRef = ref(db, `subscriptions/${address}`);
  if (subscriptions) {
    subscriptions.push(clubId);
    await set(newSubsciptionRef, subscriptions);
  } else {
    await set(newSubsciptionRef, [clubId]);
  }

  await queryClient.invalidateQueries({
    queryKey: [address, "subscribed", "clubs"],
  });
};
