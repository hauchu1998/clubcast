import { getDatabase, set, ref } from "firebase/database";
import { Vote } from "@/types/governance";
import app from "./index";
import { address } from "@/types/address";
import { queryClient } from "@/pages/_app";

export const castVoteApi = async (
  governanceAddress: address,
  proposalId: string,
  address: string,
  support: Vote
) => {
  const db = getDatabase(app);
  const newVoteRef = ref(
    db,
    `votes/${governanceAddress}/${proposalId}/${address}`
  );
  await set(newVoteRef, support);
  queryClient.invalidateQueries({
    queryKey: [governanceAddress, proposalId, address, "vote"],
  });

  queryClient.invalidateQueries({
    queryKey: [governanceAddress, proposalId, "all", "vote"],
  });
};
