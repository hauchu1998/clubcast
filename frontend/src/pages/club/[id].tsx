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

const ClubPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { result: club, loading } = useGetClub(id as string);
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [isMember, setIsMember] = useState(false);
  const { address: user } = useAccount();
  const [clubMembers, setClubMembers] = useState<address[]>([]);
  const [clubErc721, setClubErc721] = useState<address>();
  const [clubGovernance, setClubGovernance] = useState<address>();
  const { clubCastAddress } = useClubCastContract();
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
      const members = data[0].result as address[];
      const isMember = members.includes(user as address);
      setIsMember(isMember);
      setClubMembers(members);

      const erc721Address = data[1].result as address;
      setClubErc721(erc721Address);

      const governanceAddress = data[2].result as address;
      setClubGovernance(governanceAddress);
    },
    contracts: [
      {
        address: clubCastAddress as address,
        abi: ClubCast__factory.abi,
        functionName: "getClubMembers",
        args: [id as string],
      },
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
      setIsMember(true);
    }
  }, [isSuccess]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full h-[calc(100vh-5.5rem)] flex flex-col items-center">
      <div className="w-full h-full flex">
        <div className="w-[40%] h-full">
          <ClubIntro club={club} css="h-[40%] scrollbar " />
          {chain?.id === club.chainId && (isMember || isHost) && (
            <ProposalController css="h-[60%]" />
          )}
        </div>
        <div className="w-[60%] h-full ">
          {chain?.id !== club.chainId ? (
            <div className="w-full h-full flex justify-start items-center">
              <SwitchNetworkButton chainId={club.chainId} />
            </div>
          ) : isLoading ? (
            <div className="w-full h-full flex justify-start items-center">
              <div className="w-full flex gap-3 justify-center text-xl text-purple-500">
                Loading <Spinner />
              </div>
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
