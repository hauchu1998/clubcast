import { useRouter } from "next/router";
// import { club } from "@/db/clubs";
import ProposalController from "@/components/clubs/proposalController";
import EpisodeController from "@/components/clubs/episodeController";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useContractReads, useNetwork } from "wagmi";
import SwitchNetworkButton from "@/components/switchNetworkButton";
import ClubIntro from "@/components/clubs/clubIntro";
import { useGetClub } from "@/hooks/useGetClubs";
import { address } from "@/types/address";
import { ClubCast__factory } from "@/typechain-types";
import Spinner from "@/components/spinner";
import { joinClubApi } from "@/firebase/joinClubs";
import useJoinClub from "@/hooks/useJoinClub";
import usePushProtocolAccount from "@/hooks/usePushProtocolAccount";
import { polygonMumbai } from "viem/chains";
import useGetClubMembers from "@/hooks/useGetClubMembers";

const ClubPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { result: club, loading } = useGetClub(id as string);
  const { address: user } = useAccount();
  const { userPushAccount } = usePushProtocolAccount();
  const members = useGetClubMembers(id as string);
  const isMember = useMemo(
    () => members.includes(user as address),
    [members, user]
  );

  const [clubGovernance, setClubGovernance] = useState<address>();
  const { chain } = useNetwork();
  const [isLoading, setIsLoading] = useState(false);
  const { writeJoinClub, isSuccess } = useJoinClub(id as string);
  const isHost = useMemo(() => {
    if (user && club) {
      return user === club.owner;
    } else {
      return false;
    }
  }, [user, club]);

  useContractReads({
    enabled: club ? true : false,
    onSuccess: async (data) => {
      const governanceAddress = data[0].result as address;
      setClubGovernance(governanceAddress);
    },
    contracts: [
      {
        address: club?.contractAddress as address,
        abi: ClubCast__factory.abi,
        functionName: "getClubGovernance",
        args: [id as string],
        chainId: club?.chainId,
      },
    ],
  });

  const handleJoinClub = useCallback(async () => {
    try {
      setIsLoading(true);
      if (id && writeJoinClub) {
        writeJoinClub();
        await joinClubApi(user as string, id as string);
        if (chain?.id === polygonMumbai.id && club) {
          await userPushAccount?.channel.send([club.owner], {
            notification: {
              title: "New Club Member",
              body: `${user} has joined your club`,
            },
          });
        }
      } else {
        throw new Error("check if the write function or id is defined");
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }, [id, writeJoinClub, user, chain, userPushAccount, club]);

  useEffect(() => {
    if (isSuccess) {
      setIsLoading(false);
    }
  }, [isSuccess]);

  if (loading) return <div>Loading...</div>;

  if (club === undefined) return <div>Club not found</div>;

  return (
    <div className="w-full h-[calc(100vh-5.5rem)] flex flex-col items-center">
      <div className="w-full h-full flex">
        <div className="w-[40%] h-full">
          <ClubIntro club={club} css="h-[40%] scrollbar " />
          {chain?.id === club.chainId && (isMember || isHost) && (
            <ProposalController
              clubId={club.id}
              governanceAddress={clubGovernance as address}
              isMember={isMember}
              css="h-[60%]"
            />
          )}
        </div>
        <div className="w-[60%] h-full ">
          {chain?.id !== club.chainId ? (
            <div className="w-full h-full flex justify-start items-center">
              <SwitchNetworkButton chainId={club.chainId} />
            </div>
          ) : isLoading ? (
            <div className="w-full h-full flex justify-start items-center text-2xl text-purple-500">
              Loading <Spinner />
            </div>
          ) : !isMember && !isHost ? (
            <div className="w-full h-full flex justify-start items-center">
              <button
                className="bg-black text-white px-3 py-1 rounded-lg font-bold text-xl"
                onClick={handleJoinClub}
              >
                Get Club Fragment
              </button>
            </div>
          ) : (
            <EpisodeController
              clubId={club.id}
              clubName={club.name}
              isHost={isHost}
              hostAddress={club.owner}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubPage;
