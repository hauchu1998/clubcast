import { use, useCallback, useEffect, useMemo, useState } from "react";
import { Proposal, Vote } from "@/types/governance";
import { shortAddress } from "@xmtp/react-components";
import { AiOutlineClose } from "react-icons/ai";
import PieChart from "./pieChart";
import useCastVote from "@/hooks/useCastVote";
import { address } from "@/types/address";
import {
  useAccount,
  useContractEvent,
  useContractReads,
  useNetwork,
} from "wagmi";
import { ClubCastGovernor__factory } from "@/typechain-types";
import { set } from "date-fns";
import Spinner from "../spinner";
import { castVoteApi } from "@/firebase/castVote";
import useGetUserVote from "@/hooks/useGetUserVote";
import useGetAllVotes from "@/hooks/useGetAllVotes";

interface PropoaslProps {
  clubId: string;
  governanceAddress: address;
  proposal: Proposal;
}

// const proposalId =
//   "96746906373507733040695763531914744171080293021180906263408370888270499252248";

const ProposalContent = ({ governanceAddress, proposal }: PropoaslProps) => {
  const [openModal, setOpenModal] = useState(false);
  const { address } = useAccount();
  const [proposer, setProposer] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [alreadyVote, setAlreadyVote] = useState(true);
  const { data: userVote } = useGetUserVote(governanceAddress, proposal.id);
  const { data: allVotes } = useGetAllVotes(governanceAddress, proposal.id);
  const totalVotes = useMemo(() => {
    if (!allVotes) return 0;
    return allVotes.reduce((a, b) => a + b, 0);
  }, [allVotes]);
  const [timeLeft, setTimeLeft] = useState(0);
  const { vote, setVote, isSuccess, writeCastVote } = useCastVote(
    governanceAddress,
    proposal.id
  );

  useContractReads({
    enabled:
      governanceAddress !== undefined &&
      address !== undefined &&
      proposal.id !== undefined,
    onSuccess: async (data) => {
      setAlreadyVote(data[0].result as boolean);
      const startTime = Number(data[1].result);
      const endTime = Number(data[2].result);
      setTimeLeft(((endTime - startTime) * 12) / (24 * 3600));
      setProposer(data[3].result as address);
    },
    contracts: [
      {
        address: governanceAddress as `0x${string}`,
        abi: ClubCastGovernor__factory.abi,
        functionName: "hasVoted",
        args: [BigInt(proposal.id), address as address],
      },
      {
        address: governanceAddress as `0x${string}`,
        abi: ClubCastGovernor__factory.abi,
        functionName: "proposalSnapshot",
        args: [BigInt(proposal.id)],
      },
      {
        address: governanceAddress as `0x${string}`,
        abi: ClubCastGovernor__factory.abi,
        functionName: "proposalDeadline",
        args: [BigInt(proposal.id)],
      },
      {
        address: governanceAddress as `0x${string}`,
        abi: ClubCastGovernor__factory.abi,
        functionName: "proposalProposer",
        args: [BigInt(proposal.id)],
      },
    ],
  });

  useContractEvent({
    address: governanceAddress,
    abi: ClubCastGovernor__factory.abi,
    eventName: "VoteCast",
    listener: async (log) => {
      const event = log[0];
      if (event.eventName === "VoteCast") {
        const proposalId = event.args.proposalId?.toString() || "";
        const voter = event.args.voter || "";
        const support = event.args.support;
        if (
          proposalId !== undefined &&
          voter !== undefined &&
          support !== undefined
        ) {
          await castVoteApi(governanceAddress, proposalId, voter, support);
          // setProposalVotes((prev) =>
          //   prev?.map((x, index) => {
          //     if (index === support) {
          //       return x + 1;
          //     }
          //     return x;
          //   })
          // );
        }
      }
    },
  });

  const handleCastVote = useCallback(async () => {
    if (vote === undefined) return;
    try {
      setIsLoading(true);
      writeCastVote?.();
    } catch (error: any) {
      alert(error.message);
      setIsLoading(false);
    }
    setIsLoading(false);
  }, [setIsLoading, writeCastVote, vote]);

  const getUserVote = (vote: number) => {
    if (vote === Vote.Yes) {
      return "Yes";
    } else if (vote === Vote.No) {
      return "No";
    } else {
      return "Abstain";
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setIsLoading(false);
    }
  }, [isSuccess]);

  return (
    <div className="mt-2 w-full">
      <div
        key={proposal.id}
        className="h-20 border-2 border-purple-500 px-3 py-3 flex flex-col rounded-lg bg-[#f5eae8] hover:cursor-pointer"
        onClick={() => setOpenModal(true)}
      >
        <div className="flex justify-between ">
          <div className="text-lg font-bold">{proposal.title}</div>
          <div className="text-sm text-gray-700">{timeLeft} days left</div>
        </div>
        <div className="flex justify-between">
          <div className="text-sm">
            proposed by {shortAddress(proposer || "")}
          </div>
          <div className="font-semibold">
            <span className="text-red-500">
              No:{" "}
              {allVotes && totalVotes !== 0
                ? (allVotes[0] / totalVotes) * 100
                : 0}
              %
            </span>{" "}
            <span className="text-green-500">
              Yes:{" "}
              {allVotes && totalVotes !== 0
                ? (allVotes[1] / totalVotes) * 100
                : 0}
              %
            </span>{" "}
            <span className="text-blue-500">
              Abstain:{" "}
              {allVotes && totalVotes !== 0
                ? (allVotes[2] / totalVotes) * 100
                : 0}
              %
            </span>
          </div>
        </div>
      </div>

      {openModal && (
        <div className="fixed w-screen h-screen top-0 left-0 flex items-center justify-center">
          <div className="w-[40%] bg-color scrollbar rounded-lg border-2 border-purple-500">
            <div className="relative w-full py-2 rounded-t-lg bg-purple-500 flex flex-col items-center text-white ">
              <button
                className="absolute top-5 right-5 text-white text-xl"
                onClick={() => setOpenModal(false)}
              >
                <AiOutlineClose />
              </button>
              <div className="text-xl  font-semibold">
                Proposal: {proposal.title} {}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5 pb-5">
              <div className="col-span-2 px-8 py-5">
                <div className="text-sm font-semibold">
                  proposed by{" "}
                  <span className="font-medium text-cyan-500">{proposer}</span>
                </div>
                <div className="mt-3 text-lg font-semibold">Description</div>
                <div className="mt-2">{proposal.description}</div>

                <div className="mt-5 w-full ">
                  {alreadyVote ? (
                    <div className="text-orange-600 font-medium">
                      you voted {getUserVote(userVote)}
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-5">
                        <button
                          className={`${
                            vote === Vote.No
                              ? "bg-red-500 text-white"
                              : "text-red-500 "
                          } border-2 border-red-500 w-20 py-1 rounded-full font-semibold`}
                          onClick={() => setVote(Vote.No)}
                        >
                          No
                        </button>
                        <button
                          className={`${
                            vote === Vote.Yes
                              ? "bg-green-500 text-white"
                              : " text-green-500"
                          } border-2 border-green-500 w-20 py-1 rounded-full font-semibold`}
                          onClick={() => setVote(Vote.Yes)}
                        >
                          Yes
                        </button>
                        <button
                          className={`${
                            vote === Vote.Abstain
                              ? "bg-blue-500 text-white"
                              : " text-blue-500"
                          } border-2 border-blue-500 w-20 py-1 rounded-full font-semibold`}
                          onClick={() => setVote(Vote.Abstain)}
                        >
                          Abstain
                        </button>
                      </div>
                      <div className="mt-5 flex flex-col items-center">
                        <button
                          className="bg-purple-500 px-3 py-1 text-xl text-white font-semibold rounded-lg"
                          onClick={handleCastVote}
                        >
                          Vote
                        </button>
                        {isLoading && (
                          <div className="mt-3 w-full flex gap-3 justify-center text-xl text-pink-500">
                            Loading <Spinner />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center pt-5">
                <div className="w-2/3">
                  <PieChart
                    noVotes={allVotes?.[0] || 0}
                    yesVotes={allVotes?.[1] || 0}
                    abstainVotes={allVotes?.[2] || 0}
                  />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div className="text-red-500 font-semibold">
                    <div className="text-sm">No</div>
                    <div className="text-lg">{allVotes?.[0]}</div>
                  </div>
                  <div className="text-green-500 font-semibold">
                    <div className="text-sm">Yes</div>
                    <div className="text-lg">{allVotes?.[1] || 0}</div>
                  </div>
                  <div className="text-blue-500 font-semibold">
                    <div className="text-sm">Abstain</div>
                    <div className="text-lg">{allVotes?.[2]}</div>
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
