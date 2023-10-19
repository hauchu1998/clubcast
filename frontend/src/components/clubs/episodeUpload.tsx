import { uploadEpisodeApi } from "@/firebase/uploadEpisode";
import { generateRandomId } from "@/helpers/random";
import { useMediaUploaded } from "@/hooks/useMediaUploaded";
import useUpoadEpisode from "@/hooks/useUploadEpisode";
import { bangers } from "@/styles/fonts";
import { Episode, Publication } from "@/types/club";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RiVideoUploadLine } from "react-icons/ri";
import Spinner from "../spinner";
import { useAccount } from "wagmi";
import { add } from "date-fns";
import { AiOutlineClose } from "react-icons/ai";

interface EpisodeUploadProps {
  clubId: string;
  setEpisodes: Function;
}

const EpisodeUpload = ({ clubId, setEpisodes }: EpisodeUploadProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();
  const videoId = useMemo(() => generateRandomId(), []);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const { media, handleMediaChange, handleMediaUpload } = useMediaUploaded();
  const {
    title,
    setTitle,
    description,
    setDescription,
    ipfsUrl,
    setIpfsUrl,
    writePublishVideo,
    isSuccess,
  } = useUpoadEpisode(clubId, videoId);

  const handleEpisodeUploaded = useCallback(async () => {
    if (!title || !description || !media) return;
    try {
      setIsLoading(true);
      const ipfsUrl = await handleMediaUpload();
      setIpfsUrl(ipfsUrl);
      writePublishVideo?.();
      const createdAt = new Date().toLocaleDateString();
      const episode: Episode = {
        id: videoId,
        title,
        description,
        contentUrl: ipfsUrl,
        createdAt,
        likes: 0,
        dislikes: 0,
      };
      await uploadEpisodeApi(episode);
    } catch (error: any) {
      alert(error.message);
      setIsLoading(false);
    }
  }, [
    title,
    description,
    media,
    videoId,
    writePublishVideo,
    setIpfsUrl,
    setIsLoading,
    handleMediaUpload,
  ]);

  useEffect(() => {
    if (isSuccess) {
      setOpenModal(false);
      setIsLoading(false);
      setEpisodes((prev: Publication[]) => [
        ...prev,
        {
          videoId,
          publisher: address,
          md5Hash: ipfsUrl,
        },
      ]);
    }
  }, [isSuccess, address, ipfsUrl, videoId, setEpisodes]);

  return (
    <div>
      <button
        className="mt-5 w-full h-20 border-4 border-purple-500 border-dashed text-center text-5xl font-bold text-purple-500"
        onClick={() => setOpenModal(true)}
      >
        +
      </button>
      {openModal && (
        <div className="fixed w-screen h-screen top-0 left-0 flex justify-center items-center">
          <div className="w-[40%] rounded-lg border-2 border-purple-500 bg-color">
            <div className="relative h-16 flex justify-center items-center bg-purple-500 text-white rounded-t-lg">
              <button
                className="absolute top-5 right-5 text-white text-xl"
                onClick={() => setOpenModal(false)}
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

                {media && (
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
                {media && title && description && (
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
