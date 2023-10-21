import { useRouter } from "next/router";
// import { club } from "@/db/clubs";
import ProposalController from "@/components/clubs/proposalController";
import EpisodeController from "@/components/clubs/episodeController";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useContractReads, useNetwork } from "wagmi";
import SwitchNetworkButton from "@/components/switchNetworkButton";
import ClubIntro from "@/components/clubs/clubIntro";
import { useGetClub } from "@/hooks/useGetClubs";
import { useClubCastContract } from "@/hooks/useClubCastContract";
import { address } from "@/types/address";
import { ClubCast__factory } from "@/typechain-types";
import Spinner from "@/components/spinner";
import { joinClubApi } from "@/firebase/joinClubs";
import useJoinClub from "@/hooks/useJoinClub";
import { governance } from "@/typechain-types/@openzeppelin/contracts";
import { set } from "date-fns";
import usePushProtocolAccount from "@/hooks/usePushProtocolAccount";
import { polygonMumbai } from "viem/chains";
import useGetClubMembers from "@/hooks/useGetClubMembers";

const ClubPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { result: club, loading } = useGetClub(id as string);
  const { address } = useAccount();
  const { address: user } = useAccount();
  // const { userPushAccount } = usePushProtocolAccount();
  const members = useGetClubMembers(id as string);
  const isMember = useMemo(
    () => members.includes(user as address),
    [members, user]
  );
  const [clubErc721, setClubErc721] = useState<address>();
  const [clubGovernance, setClubGovernance] = useState<address>();
  const { chain, clubCastAddress } = useClubCastContract();
  const [isLoading, setIsLoading] = useState(false);
  const { writeJoinClub, isSuccess } = useJoinClub(id as string);
  const isHost = useMemo(() => {
    if (address && club) {
      return address === club.owner;
    } else {
      return false;
    }
  }, [address, club]);

  useContractReads({
    enabled: clubCastAddress ? true : false,
    onSuccess: async (data) => {
      const erc721Address = data[0].result as address;
      setClubErc721(erc721Address);

      const governanceAddress = data[1].result as address;
      setClubGovernance(governanceAddress);
    },
    contracts: [
      {
        address: clubCastAddress as address,
        abi: ClubCast__factory.abi,
        functionName: "getClubErc721",
        args: [id as string],
      },
      {
        address: clubCastAddress as address,
        abi: ClubCast__factory.abi,
        functionName: "getClubGovernance",
        args: [id as string],
      },
    ],
  });

  const handleJoinClub = useCallback(async () => {
    try {
      setIsLoading(true);
      if (id && writeJoinClub) {
        writeJoinClub();
        await joinClubApi(address as string, id as string);
        // if (chain?.id === polygonMumbai.id) {
        //   await userPushAccount?.channel.send([club.owner], {
        //     notification: {
        //       title: "New Club Member",
        //       body: `${user} has joined your club`,
        //     },
        //   });
        // }
      } else {
        throw new Error("check if the write function or id is defined");
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }, [id, writeJoinClub, address]);

  useEffect(() => {
    if (isSuccess) {
      setIsLoading(false);
    }
  }, [isSuccess]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full h-[calc(100vh-5.5rem)] flex flex-col items-center">
      <div className="w-full h-full flex">
        <div className="w-[40%] h-full">
          <ClubIntro club={club} css="h-[40%] scrollbar " />
          {chain?.id === club.chainId && (isMember || isHost) && (
            <ProposalController
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
              clubId={id as string}
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
