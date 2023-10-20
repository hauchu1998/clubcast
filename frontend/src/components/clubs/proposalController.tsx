import { bangers } from "@/styles/fonts";
import ProposalContent from "./proposal";
import { Proposal } from "@/types/club";
import { address } from "@/types/address";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import ProposalModal from "./proposalModal";
import { useContractEvent } from "wagmi";
import { ClubCastGovernor__factory } from "@/typechain-types";
interface ProposalControllerProps {
  governanceAddress: address;
  isMember: boolean;
  css: string;
}

const governanceProposals: Proposal[] = [
  {
    id: "asdfasdfager",
    title: "Puppies in Bali",
    proposer: "0x8F0D0011c2D3B6597Fa958bF2E551a69762c07Ab",
    description:
      "We're seeking your support to create a heartwarming video featuring adorable puppies in Bali in collaboration with a renowned influencer. We need to borrow 10,000 Matics to make this dream project a reality, and we're excited to share the details with you.",
    expiration: new Date("30 Oct 2023 03:59:08 GMT"),
    yes: 400,
    abstain: 50,
    no: 100,
    user: 2,
  },
  {
    id: "asdghaleroiur",
    title: "Puppies in Andorra",
    proposer: "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC",
    description:
      "We're seekinuserr support to create a heartwarming video featuring adorable puppies in Bali in collaboration with a renowned influencer. We need to borrow 10,000 Matics to make this dream project a reality, and we're excited to share the details with you.",
    expiration: new Date("16 Oct 2023 03:59:08 GMT"),
    yes: 100,
    abstain: 13,
    no: 101,
    user: 0,
  },
];

const ProposalController = ({
  governanceAddress,
  isMember,
  css,
}: ProposalControllerProps) => {
  const [proposal, setProposals] = useState<Proposal[]>(governanceProposals);
  useContractEvent({
    address: governanceAddress,
    abi: ClubCastGovernor__factory.abi,
    eventName: "ProposalCreated",
    listener(log) {
      console.log(log);
    },
  });

  return (
    <div className={`${css} relative w-full pl-10 `}>
      <div className={`${bangers.className} text-center text-3xl`}>
        Proposals
      </div>
      <ProposalModal
        isMember={isMember}
        governanceAddress={governanceAddress}
        setProposals={setProposals}
      />
      <div className="w-full h-full scrollbar">
        {
          // @ts-ignore
          governanceProposals.map((proposal) => (
            <ProposalContent key={proposal.id} proposal={proposal} />
          ))
        }
      </div>
    </div>
  );
};

export default ProposalController;
