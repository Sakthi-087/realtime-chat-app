import React, { useMemo } from "react";

const AuthImagePattern = ({
  title,
  subtitle,
  gridSize = 3,
  animateEven = true,
  animateClass = "animate-pulse",
  bgColor="bg-blue-500/20",
}) => {
  const totalSquares = gridSize * gridSize;

  const gridItems = useMemo(
    () =>
      Array.from({ length: totalSquares }, (_, i) => (
        <div
          key={i}
          className={`aspect-square rounded-2xl ${bgColor} ${
            animateEven && i % 2 === 0 ? animateClass : ""
          }`}
        />
      )),
    [totalSquares, animateEven, animateClass, bgColor]
  );

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div
          className={`grid grid-cols-${gridSize} gap-3 mb-8`}
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {gridItems}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
