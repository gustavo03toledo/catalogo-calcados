import React from 'react';

export default function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm animate-pulse flex flex-col"
        >
          {/* Imagem Quadrada Skeleton */}
          <div className="aspect-square w-full bg-zinc-200" />

          {/* Conteúdo do Card Skeleton */}
          <div className="p-3 sm:p-4 flex flex-col gap-3 flex-1">
            <div className="h-3.5 bg-zinc-200 rounded-md w-2/3" />

            <div className="space-y-1.5">
              <div className="h-3 bg-zinc-200 rounded w-1/2" />
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 5 }).map((__, i) => (
                  <div
                    key={i}
                    className="h-8 w-9 bg-zinc-200 rounded-lg"
                  />
                ))}
              </div>
            </div>

            <div className="mt-auto pt-1">
              <div className="h-10 w-full bg-zinc-200 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
