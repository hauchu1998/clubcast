import Image from "next/image";
import { uploadEpisodeApi } from "@/firebase/uploadEpisode";
import { generateRandomId } from "@/helpers/random";
import { useMediaUploaded } from "@/hooks/useMediaUploaded";
import useUploadEpisode from "@/hooks/useUploadEpisode";
import { bangers } from "@/styles/fonts";
import { Episode } from "@/types/club";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RiVideoUploadLine } from "react-icons/ri";
import Spinner from "../spinner";
import { useAccount, useNetwork } from "wagmi";
import { AiOutlineClose } from "react-icons/ai";
import { useClubCastContract } from "@/hooks/useClubCastContract";
import useGetClubMembers from "@/hooks/useGetClubMembers";

interface EpisodeUploadProps {
  clubId: string;
  clubName: string;
  setEpisodes: Function;
}

const EpisodeUpload = ({
  clubId,
  clubName,
  setEpisodes,
}: EpisodeUploadProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { chain } = useNetwork();
  const members = useGetClubMembers(clubId);
  const { address } = useAccount();
  // const { userPushAccount } = usePushProtocolAccount();
  const videoId = useMemo(() => generateRandomId(), []);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const { media, setMedia, mediaUrl, handleMediaChange, handleMediaUpload } =
    useMediaUploaded();
  const {
    title,
    setTitle,
    description,
    setDescription,
    ipfsUrl,
    setIpfsUrl,
    handlePublishEpisode,
    isSuccess,
  } = useUploadEpisode(clubId, videoId);

  const handleUploadToIpfs = useCallback(async () => {
    if (media) {
      setIsLoading(true);
      const ipfsUrl = await handleMediaUpload();
      setIpfsUrl(ipfsUrl);
      setIsLoading(false);
    }
  }, [media, handleMediaUpload, setIpfsUrl, setIsLoading]);

  const handleEpisodeUploaded = useCallback(async () => {
    if (!title || !description || !media) return;
    try {
      setIsLoading(true);
      const episode: Episode = await handlePublishEpisode();
      await uploadEpisodeApi(episode);
      setEpisodes((prev: Episode[]) => [episode, ...prev]);
      // if (chain?.id === polygonMumbai.id) {
      //   await userPushAccount?.channel.send(members, {
      //     notification: {
      //       title: "New Episode",
      //       body: `${clubName} has new episode, check it out!`,
      //     },
      //   });
      // }
      // setIsLoading(false);
    } catch (error: any) {
      alert(error.message);
      setIsLoading(false);
    }
  }, [
    title,
    description,
    media,
    handlePublishEpisode,
    setIsLoading,
    setEpisodes,
    // chain,
    // clubName,
    // members,
    // userPushAccount,
  ]);

  useEffect(() => {
    if (isSuccess) {
      setOpenModal(false);
      setIsLoading(false);
    }
  }, [isSuccess]);

  return (
    <div>
      <button
        className="mt-5 w-full h-20 border-4 border-purple-500 border-dashed text-center text-5xl font-bold text-purple-500"
        onClick={() => {
          setOpenModal(true);
          setMedia(null);
          setTitle("");
          setDescription("");
          setIpfsUrl("");
        }}
      >
        +
      </button>
      {openModal && (
        <div className="fixed w-screen h-screen top-0 left-0 flex justify-center items-center">
          <div className="w-[40%] rounded-lg border-2 border-purple-500 bg-color">
            <div className="relative h-16 flex justify-center items-center bg-purple-500 text-white rounded-t-lg">
              <button
                className="absolute top-5 right-5 text-white text-xl"
                onClick={() => {
                  setOpenModal(false);
                  setIsLoading(false);
                }}
              >
                <AiOutlineClose />
              </button>
              <div className="text-2xl font-semibold">Upload Episode</div>
            </div>
            <div className="px-10 py-5">
              <div className={`${bangers.className} text-3xl`}>
                Episode Title
              </div>
              <input
                type="text"
                className="w-full bg-transparent px-3 py-1 text-lg border border-black rounded-lg"
                placeholder="Enter Episode Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className={`${bangers.className} mt-5 text-3xl`}>
                Description
              </div>
              <textarea
                className="w-full bg-transparent px-3 py-1 text-lg border border-black rounded-lg"
                placeholder="Enter Episode Description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="w-full">
                <div className="mt-5 flex gap-3 items-center text-3xl">
                  <div className={`${bangers.className}`}>Video Preview</div>
                  <button
                    className=" text-cyan-500"
                    onClick={() => inputFileRef.current?.click()}
                  >
                    <RiVideoUploadLine />
                  </button>
                </div>

                {media && media.type.includes("video") && (
                  <video
                    key={media.name}
                    className="w-full"
                    autoPlay={false}
                    controls={true}
                    muted={false}
                  >
                    <source
                      src={URL.createObjectURL(media)}
                      type={media.type}
                    />
                  </video>
                )}
                {media && media.type.includes("image") && (
                  <Image
                    src={mediaUrl || ""}
                    className="w-full"
                    width={500}
                    height={500}
                    alt="image preview"
                  />
                )}
                {ipfsUrl && (
                  <div className="w-full text-center text-cyan-500 break-words">
                    ipfs url: {ipfsUrl}
                  </div>
                )}
                <input
                  className="w-52 truncate"
                  type="file"
                  id="club-image"
                  ref={inputFileRef}
                  onChange={handleMediaChange}
                  aria-label={"File picker"}
                  accept="image/*, video/*"
                  hidden
                />
                {media && !ipfsUrl && (
                  <div className="w-full flex justify-center">
                    <button
                      className={`${bangers.className} mt-5 px-3 py-1 bg-black text-white text-2xl rounded-lg`}
                      onClick={handleUploadToIpfs}
                    >
                      Upload to IPFS
                    </button>
                  </div>
                )}
                {title && description && ipfsUrl && (
                  <div className="w-full flex justify-center">
                    <button
                      className={`${bangers.className} mt-5 px-3 py-1 bg-black text-white text-2xl rounded-lg`}
                      onClick={handleEpisodeUploaded}
                    >
                      Upload
                    </button>
                  </div>
                )}
                {isLoading && (
                  <div className="w-full flex gap-3 justify-center text-xl text-pink-500">
                    Loading <Spinner />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodeUpload;
