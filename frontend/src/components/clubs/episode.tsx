import Blockies from "react-blockies";
import { Episode } from "@/types/club";
import { AiOutlineMessage } from "react-icons/ai";
import { PiHeartBreak, PiHeart } from "react-icons/pi";
import { useGetEpisode } from "@/hooks/useGetEpisode";

interface EpisodeContentProps {
  episode: Episode;
  hostAddress: string;
}

const EpisodeContent = ({ episode, hostAddress }: EpisodeContentProps) => {
  return (
    <div className="mt-5 border border-gray-300 pt-5">
      <div className="flex gap-3 px-5">
        <Blockies
          data-testid="avatar"
          seed={hostAddress.toLowerCase() || ""}
          scale={5}
          size={10}
          className="rounded-full"
        />
        <div>
          <div className="font-semibold text-lg">{hostAddress}</div>
          <div className="font-semibold text-gray-400">{episode.createdAt}</div>
        </div>
      </div>
      <div className="mt-5 px-5">
        <div className="font-semibold text-lg ">Topic: {episode.title}</div>
        <div className="">{episode.description}</div>
      </div>
      <div className="w-full">
        <iframe
          className="w-full mt-5"
          src={episode.ipfsUrl}
          // scrolling="no"
          height="450px"
        />
      </div>

      <div className="mt-3 flex gap-3 px-5">
        <button className="text-pink-500 text-lg flex items-center gap-2 rounded-full hover:font-bold">
          <PiHeartBreak />
          {Number(episode.dislikes)}
        </button>
        <button className="text-cyan-500 text-xl flex items-center gap-2 rounded-full  hover:font-bold">
          <PiHeart />
          {Number(episode.likes)}
        </button>
        <button className="text-purple-500 text-xl flex items-center gap-2 rounded-full  hover:font-bold">
          <AiOutlineMessage />0{/* {episode.comments.length} */}
        </button>
      </div>
      <div className="mt-3 px-5 py-2 border-t border-gray-300">
        <input
          className="w-full border border-gray-300 hover:border-purple-300 bg-transparent rounded-full px-3 py-1"
          placeholder="Leave a comment"
        />
      </div>
    </div>
  );
};

export default EpisodeContent;
