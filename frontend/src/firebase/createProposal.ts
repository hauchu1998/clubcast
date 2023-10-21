import { getDatabase, set, ref } from "firebase/database";
import { Proposal } from "@/types/governance";
import app from "./index";
import { address } from "@/types/address";
import { fetchAllPorposals } from "./getProposals";
import { queryClient } from "@/pages/_app";

export const createProposalApi = async (
  governanceAddress: address,
  proposal: Proposal
) => {
  const db = getDatabase(app);
  const proposals = await fetchAllPorposals(governanceAddress);
  const newProposalRef = ref(db, `proposals/${governanceAddress}`);
  if (proposals) {
    proposals.push(proposal);
    await set(newProposalRef, proposals);
  } else {
    await set(newProposalRef, [proposal]);
  }

  queryClient.invalidateQueries({
    queryKey: [governanceAddress, "all", "proposals"],
  });
};
