import React from "react";
import RatingProgress from "../components/starProggress";
import TruncateText from "../components/truncateText";
import { IconsPlay } from "../components/iconsweb"; // Updated import

function AnimeCardss() {
  return (
    <div className="flex font-rubik items-center justify-center h-screen bg-black w-full">
      <div className="grid">
        <div className="group cursor-pointer bg-white min-h-[400px] max-h-[590px] min-w-[250px] max-w-[250px] relative rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
          <div className="flex w-full items-center justify-center relative">
            <img
              src="https://image.tmdb.org/t/p/w300/9XzYuXioQJr7Ry2KuHErLl8w6ff.jpg"
              alt="Movie Poster"
              className="object-cover group-hover:brightness-50 w-full h-full"
            />
            <div className="flex items-center flex-col p-2 absolute w-full h-full bg-gradient-to-b from-transparent via-transparent to-black justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              <div className="flex items-center justify-center absolute left-2 top-2">
                <RatingProgress rating={8.5} />
              </div>
              <IconsPlay size={30} /> {/* Updated component name */}
            </div>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <p className="flex font-bold items-center rounded-lg text-[12px]">
              12 Nov 2024
            </p>
            <TruncateText
              as="h1"
              className="font-bold text-sm"
              text="Shirobuta Kizoku desu ga Zense no Kioku ga Haeta node Hiyoko na Otouto Sodatemasu"
              maxChars={50}
              maxLines={120}
            />
            <div className="flex items-center justify-between">
              <p className="flex font-bold items-center rounded-lg text-xs">
                Drama
              </p>
              <p className="flex font-bold items-center py-1 px-2 bg-gray-200 rounded-lg text-xs">
                TV
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeCardss;