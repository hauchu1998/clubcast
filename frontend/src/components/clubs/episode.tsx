import { Episode } from "@/types/club";
import {
  BsFillHandThumbsUpFill,
  BsFillHandThumbsDownFill,
} from "react-icons/bs";

interface EpisodeContentProps {
  episode: Episode;
  css?: string;
}

const EpisodeContent = ({ episode, css }: EpisodeContentProps) => {
  return (
    <div className="mt-5 border border-gray-300 flex flex-col items-center p-3">
      <div className="grid grid-cols-2 gap-3">
        <iframe
          className="w-full"
          height={375}
          width={560}
          src={episode.contentUrl.replace("watch?v=", "embed/")}
        />
        <div>
          <div className="font-bold text-xl">{episode.title}</div>
          <div className="font-bold text-gray-400">{episode.createdAt}</div>
          <div className="text-lg">{episode.description}</div>
          <div className="mt-3 flex gap-3">
            <button className="bg-pink-500 px-3 py-1 text-white flex items-center gap-2 rounded-full">
              <BsFillHandThumbsDownFill /> {episode.dislikes}
            </button>
            <button className=" bg-cyan-500 px-3 py-1 text-white flex items-center gap-2 rounded-full">
              <BsFillHandThumbsUpFill /> {episode.likes}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeContent;
