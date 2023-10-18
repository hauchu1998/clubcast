import { getDatabase, set, ref } from "firebase/database";
import { queryClient } from "@/pages/_app";
import app from "./index";
import { fetchUserSubscribedClubs } from "./getClubs";
import { sub } from "date-fns";

export const joinClubApi = async (address: string, clubId: string) => {
  const db = getDatabase(app);
  const subscriptions = await fetchUserSubscribedClubs(address);
  if (subscriptions) {
    subscriptions.push(clubId);

    const newSubsciptionRef = ref(db, `subscriptions/${address}`);
    await set(newSubsciptionRef, subscriptions);
  } else {
    const newSubsciptionRef = ref(db, `subscriptions/${address}`);
    await set(newSubsciptionRef, [clubId]);
  }

  await queryClient.invalidateQueries({
    queryKey: [address, "subscribed", "clubs"],
  });
};
