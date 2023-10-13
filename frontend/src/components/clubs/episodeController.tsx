import { Episode } from "@/types/club";
import EpisodeContent from "./episode";

interface EpisodeControllerProps {
  episodes: Episode[];
  isHost: boolean;
}

const EpisodeController = ({ isHost, episodes }: EpisodeControllerProps) => {
  return (
    <div className="w-full h-full px-3 scrollbar">
      {isHost && (
        <button className="mt-5 w-full h-20 border-4 border-purple-500 border-dashed text-center text-5xl font-bold text-purple-500">
          +
        </button>
      )}
      {episodes.map((episode) => (
        <EpisodeContent key={episode.id} episode={episode} />
      ))}
    </div>
  );
};

export default EpisodeController;
