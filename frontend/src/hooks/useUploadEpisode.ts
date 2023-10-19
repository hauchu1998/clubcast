import { ClubCast__factory } from "@/typechain-types";
import { address } from "@/types/address";
import { Episode } from "@/types/club";
import { useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

const useUpoadEpisode = (clubId: string, id: string) => {
  const [createdAt, setCreatedAt] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ipfsUrl, setIpfsUrl] = useState("");

  const { config } = usePrepareContractWrite({
    address: (process.env.NEXT_PUBLIC_SCROLL_CLUBCAST_ADDRESS as address) || "",
    abi: ClubCast__factory.abi,
    functionName: "publishEpisode",
    args: [clubId, id, createdAt, title, description, ipfsUrl],
  });
  const { data, write: writePublishEpisode } = useContractWrite(config);
  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash as `0x${string}`,
  });

  const handlePublishEpisode = async () => {
    const timestamp = new Date();
    setCreatedAt(
      `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`
    );
    writePublishEpisode?.();
    return {
      id,
      title,
      description,
      ipfsUrl,
      createdAt: `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`,
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
