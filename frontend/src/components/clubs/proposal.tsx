import { useState } from "react";
import { Proposal, Vote } from "@/types/club";
import { shortAddress } from "@xmtp/react-components";
import { AiOutlineClose } from "react-icons/ai";
import PieChart from "./pieChart";

interface PropoaslProps {
  proposal: Proposal;
}
const ProposalContent = ({ proposal }: PropoaslProps) => {
  const [isShow, setIsShow] = useState(false);
  const handleVote = (vote: number) => {
    if (vote === Vote.Yes) {
      return "Yes";
    } else if (vote === Vote.No) {
      return "No";
    } else {
      return "Undecided";
    }
  };

  const getUserVote = (vote: number) => {
    if (vote === Vote.Yes) {
      return "Yes";
    } else if (vote === Vote.No) {
      return "No";
    } else {
      return "Undecided";
    }
  };

  const getVoteResult = (yes: number, no: number) => {
    const total = yes + no;
    if (yes > no) {
      return `${((yes / total) * 100).toFixed(1)}% for Yes`;
    } else {
      return `${((no / total) * 100).toFixed(1)}% for No`;
    }
  };

  const getDaysLeft = (expiration: Date) => {
    const today = new Date();
    const diff = expiration.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
  };

  const handleCloseModal = () => {
    setIsShow(false);
  };

  return (
    <div className="mt-2 w-full">
      <div
        key={proposal.id}
        className="h-20 border border-purple-500 px-3 py-3 flex flex-col rounded-lg bg-[#f5eae8] hover:cursor-pointer"
        onClick={() => setIsShow(true)}
      >
        <div className="flex justify-between ">
          <div className="text-lg font-bold">{proposal.title}</div>
          <div className="text-sm text-gray-700">
            {getDaysLeft(proposal.expiration)} days left
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-sm">
            proposed by {shortAddress(proposal.proposer)}
          </div>
          <div
            className={`${
              proposal.yes > proposal.no ? "text-green-500" : "text-red-500"
            } font-semibold`}
          >
            {getVoteResult(proposal.yes, proposal.no)}
          </div>
        </div>
      </div>

      {isShow && (
        <div className="fixed w-screen h-screen top-0 left-0 flex items-center justify-center">
          <div className="w-[40%] bg-white scrollbar rounded-lg border-2 border-purple-500">
            <div className="relative w-full py-2 rounded-t-lg bg-purple-500 flex flex-col items-center text-white ">
              <button
                className="absolute top-5 right-5 text-white text-xl"
                onClick={handleCloseModal}
              >
                <AiOutlineClose />
              </button>
              <div className="text-xl  font-semibold">
                Proposal: {proposal.title} {}
              </div>
              <div className="text-sm underline">click outside to close</div>
            </div>
            <div className="grid grid-cols-3 gap-5 pb-5">
              <div className="col-span-2 px-8 py-5">
                <div className="text-sm">
                  proposed by{" "}
                  <span className="font-medium text-cyan-500">
                    {proposal.proposer}
                  </span>
                </div>
                <div className="mt-3 text-lg font-semibold">Description</div>
                <div className="mt-2">{proposal.description}</div>

                <div className="mt-5 w-full text-orange-600">
                  {proposal.user
                    ? `You voted ${getUserVote(proposal.user)}`
                    : "You haven't voted yet"}
                </div>
                <div className="mt-3 flex gap-5">
                  <button
                    className="border-2 border-red-500 text-red-500 w-20 py-1 rounded-full font-semibold"
                    onClick={() => handleVote(0)}
                  >
                    No
                  </button>
                  <button
                    className="border-2 border-blue-500 text-blue-500 w-20 py-1 rounded-full font-semibold"
                    onClick={() => handleVote(1)}
                  >
                    Abstain
                  </button>
                  <button
                    className="border-2 border-green-500 text-green-500 w-20 py-1 rounded-full font-semibold"
                    onClick={() => handleVote(2)}
                  >
                    Yes
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center pt-5">
                <div className="w-2/3">
                  <PieChart
                    yesVotes={proposal.yes}
                    noVotes={proposal.no}
                    abstainVotes={proposal.abstain}
                  />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div className="text-red-500 font-semibold">
                    <div className="text-sm">No</div>
                    <div className="text-lg">{proposal.no}</div>
                  </div>
                  <div className="text-blue-500 font-semibold">
                    <div className="text-sm">Abstain</div>
                    <div className="text-lg">{proposal.abstain}</div>
                  </div>
                  <div className="text-green-500 font-semibold">
                    <div className="text-sm">Yes</div>
                    <div className="text-lg">{proposal.yes}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalContent;
