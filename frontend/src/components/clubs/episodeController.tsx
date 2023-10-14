import { Episode } from "@/types/club";
import EpisodeContent from "./episode";

interface EpisodeControllerProps {
  episodes: Episode[];
  hostAddress: string;
  isHost: boolean;
}

const EpisodeController = ({
  isHost,
  hostAddress,
  episodes,
}: EpisodeControllerProps) => {
  return (
    <div className="mt-5 w-full h-full px-3 scrollbar flex justify-center">
      <div className="w-[90%] pr-20">
        {isHost && (
          <button className="mt-5 w-full h-20 border-4 border-purple-500 border-dashed text-center text-5xl font-bold text-purple-500">
            +
          </button>
        )}
        {episodes.map((episode) => (
          <EpisodeContent
            key={episode.id}
            hostAddress={hostAddress}
            episode={episode}
          />
        ))}
      </div>
    </div>
  );
};

export default EpisodeController;
