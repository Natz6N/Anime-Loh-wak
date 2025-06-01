import React from "react";

interface RatingProgressProps {
  rating: number;
}

const CircleRatingProgress = ({ rating }: RatingProgressProps) => {
  const maxRating = 10;
  const percentage = (rating / maxRating) * 100;
  const radius = 40;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-[45px] h-[45px]">
      <svg
        className="transform -rotate-90"
        width="100%"
        height="100%" 
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={stroke}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#FACC15" // Tailwind yellow-400
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>

      {/* Rating text in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-sm font-bold">{rating.toFixed(1)}</span>
        {/* <span className="text-xs font-light">/ {maxRating}</span> */}
      </div>
    </div>
  );
};

export default CircleRatingProgress;
