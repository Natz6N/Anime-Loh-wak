// AnimeCard.tsx - Alternative simpler solution
import React from "react";
import { Link } from "react-router-dom";
import { Anime } from "../types/anime";
import RatingProgress from "./starProggress";
import TruncateText from "./truncateText";
import { IconsPlay } from "./iconsweb";

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  return (
    <Link
      to={`/anime/${anime.id}`}
      className="cursor-pointer bg-white h-fit w-full max-w-[250px] relative rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
    >
      <div className="flex w-full items-center justify-center relative group">
        <img
          src={anime.image}
          alt={anime.title}
          className="object-cover group-hover:brightness-50 w-full h-full transition-all duration-300"
        />
        <div className="flex items-center flex-col p-2 absolute w-full h-full bg-gradient-to-b from-transparent via-transparent to-black justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <div className="flex items-center justify-center absolute left-2 top-2">
            <RatingProgress className="font-white" rating={anime.rating} />
          </div>
          <IconsPlay size={30} />
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <p className="flex font-bold items-center rounded-lg text-[12px]">
          {anime.releaseYear}
        </p>
        <TruncateText
          as="h1"
          className="font-bold text-sm"
          text={anime.title}
          maxChars={50}
          maxLines={120}
        />
        <div className="flex items-center justify-between">
          <p className="flex font-bold items-center rounded-lg text-xs">
            {anime.genres[0] || "Unknown Genre"}
          </p>
          <p className="flex font-bold items-center py-1 px-2 bg-gray-200 rounded-lg text-xs">
            {anime.type || "Unknown Type"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
