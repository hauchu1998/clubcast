import { ClubCast__factory } from "@/typechain-types";
import { address } from "@/types/address";
import { Episode } from "@/types/club";
import { useEffect, useMemo, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useClubCastContract } from "./useClubCastContract";

const useUpoadEpisode = (clubId: string, id: string) => {
  const { chain, clubCastAddress } = useClubCastContract();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ipfsUrl, setIpfsUrl] = useState("");

  const createdAt = useMemo(() => {
    if (!ipfsUrl || !title || !description) return "";
    const timestamp = new Date();
    return `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`;
  }, [ipfsUrl, title, description]);

  const { data, write: writePublishEpisode } = useContractWrite({
    address: clubCastAddress,
    abi: ClubCast__factory.abi,
    functionName: "publishEpisode",
    args: [clubId, id, createdAt, title, description, ipfsUrl],
    chainId: chain?.id,
  });

  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash as `0x${string}`,
  });

  const handlePublishEpisode = async () => {
    writePublishEpisode?.();
    return {
      id,
      title,
      description,
      ipfsUrl,
      createdAt,
      likes: 0,
      dislikes: 0,
    } as Episode;
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    ipfsUrl,
    setIpfsUrl,
    handlePublishEpisode,
    isSuccess,
  };
};

export default useUpoadEpisode;
