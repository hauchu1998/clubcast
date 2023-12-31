import { bangers } from "@/styles/fonts";
import ProposalContent from "./proposal";
import { Proposal } from "@/types/governance";
import { address } from "@/types/address";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import ProposalModal from "./proposalModal";
import { useContractEvent } from "wagmi";
import { ClubCastGovernor__factory } from "@/typechain-types";
import { createProposalApi } from "@/firebase/createProposal";
import useGetAllProposals from "@/hooks/useGetAllProposals";
import Spinner from "../spinner";
import { useGetClub } from "@/hooks/useGetClubs";
interface ProposalControllerProps {
  clubId: string;
  governanceAddress: address;
  isMember: boolean;
  css: string;
}

const ProposalController = ({
  clubId,
  governanceAddress,
  isMember,
  css,
}: ProposalControllerProps) => {
  const { result: club } = useGetClub(clubId);
  const {
    data: proposals,
    isLoading,
    isSuccess,
  } = useGetAllProposals(governanceAddress);
  useContractEvent({
    address: governanceAddress,
    abi: ClubCastGovernor__factory.abi,
    chainId: club?.chainId,
    eventName: "ProposalCreated",
    listener: async (log) => {
      const event = log[0];
      console.log("ProposalCreated", event);
      if (event.eventName === "ProposalCreated") {
        const { title, description } = JSON.parse(
          event.args.description as string
        );
        const proposal: Proposal = {
          id: event.args.proposalId?.toString() || "",
          blockNumber: Number(event.blockNumber),
          title,
          description,
        };
        await createProposalApi(governanceAddress, proposal);
      }
    },
  });

  if (isLoading)
    return (
      <div className="w-full flex gap-3 justify-center text-xl text-black-500">
        Loading <Spinner />
      </div>
    );

  return (
    <div className={`${css} relative w-full pl-10 `}>
      <div className={`${bangers.className} text-center text-3xl`}>
        Proposals
      </div>
      <ProposalModal
        isMember={isMember}
        clubId={clubId}
        governanceAddress={governanceAddress}
      />
      <div className="w-full h-full scrollbar">
        {
          // @ts-ignore
          proposals &&
            proposals.map((proposal: Proposal) => (
              <ProposalContent
                key={proposal.id}
                clubId={clubId}
                governanceAddress={governanceAddress}
                proposal={proposal}
              />
            ))
        }
      </div>
    </div>
  );
};

export default ProposalController;
