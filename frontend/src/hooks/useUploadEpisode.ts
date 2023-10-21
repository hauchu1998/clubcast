import { ClubCast__factory } from "@/typechain-types";
import { address } from "@/types/address";
import { Episode } from "@/types/club";
import { useMemo, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useClubCastContract } from "./useClubCastContract";

const useUpoadEpisode = (clubId: string, id: string) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ipfsUrl, setIpfsUrl] = useState("");
  const { clubCastAddress } = useClubCastContract();
  const createdAt = useMemo(() => {
    if (!ipfsUrl || !title || !description) return "";
    const timestamp = new Date();
    return `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`;
  }, [ipfsUrl, title, description]);

  // const { config } = usePrepareContractWrite({
  //   address: clubCastAddress,
  //   abi: ClubCast__factory.abi,
  //   functionName: "publishEpisode",
  //   args: [clubId, id, createdAt, title, description, ipfsUrl],
  // });
  const { data, write: writePublishEpisode } = useContractWrite({
    address: clubCastAddress,
    abi: ClubCast__factory.abi,
    functionName: "publishEpisode",
    args: [clubId, id, createdAt, title, description, ipfsUrl],
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
