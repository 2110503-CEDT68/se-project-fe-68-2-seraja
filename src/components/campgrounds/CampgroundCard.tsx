"use client";

import Image from "next/image";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Campground } from "@/types";

interface CampgroundCardProps {
  campground: Campground;
  onView?: (id: string) => void;
}

export default function CampgroundCard({
  campground,
  onView,
}: CampgroundCardProps) {
  const {
    _id,
    name,
    address,
    district,
    province,
    postalcode,
    tel,
    region,
    averageRating,
  } = campground;

  const hasRating =
    typeof averageRating === "number" && !Number.isNaN(averageRating);
  const ratingValue = hasRating ? Math.max(0, Math.min(5, averageRating!)) : 0;
  const ratingLabel = hasRating ? ratingValue.toFixed(1) : "—";

  const details = [
    { label: "Address", value: address },
    { label: "District", value: district },
    { label: "Province", value: province },
    { label: "Postal Code", value: postalcode },
    { label: "Tel", value: tel },
  ];

  return (
    <Card hoverable className="overflow-hidden flex flex-col h-full" data-testid="campground-card">
      <div
        style={{
          position: "relative",
          height: "200px",
          width: "100%",
          background: "#f3f4f6",
        }}
      >
        <Image
          src="/img/campImg.jpg"
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div
          className={`absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg ring-1 backdrop-blur-md transition-transform ${
            hasRating
              ? "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white ring-white/40"
              : "bg-white/85 text-gray-500 ring-white/60"
          }`}
          aria-label={
            hasRating ? `Average rating ${ratingLabel} out of 5` : "No reviews"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`h-3.5 w-3.5 ${
              hasRating ? "drop-shadow-sm" : "text-gray-400"
            }`}
            aria-hidden="true"
          >
            <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
          <span className="tracking-wide">{ratingLabel}</span>
          {hasRating && (
            <span className="text-[10px] font-medium text-white/80">/ 5</span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-grow gap-3 p-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 line-clamp-1" data-testid="campground-name">
            {name}
          </h2>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.15em]">
              {region}
            </p>
          </div>

          <div
            className={`mt-3 flex items-center gap-2.5 rounded-xl px-3 py-2 ring-1 ${
              hasRating
                ? "bg-gradient-to-r from-sky-50 to-blue-50 ring-blue-200/70"
                : "bg-gray-50 ring-gray-200"
            }`}
            aria-label={
              hasRating
                ? `Average rating ${ratingLabel} out of 5`
                : "No reviews yet"
            }
          >
            <div className="relative inline-flex text-base leading-none">
              <div className="text-gray-300 tracking-tight">★★★★★</div>
              <div
                className="absolute inset-0 overflow-hidden tracking-tight bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent"
                style={{ width: `${(ratingValue / 5) * 100}%` }}
                aria-hidden="true"
              >
                ★★★★★
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-sm font-bold ${
                  hasRating ? "text-blue-700" : "text-gray-400"
                }`}
              >
                {ratingLabel}
              </span>
              {hasRating && (
                <span className="text-[10px] font-medium text-blue-500/80">
                  / 5.0
                </span>
              )}
            </div>
            <span
              className={`ml-auto text-[10px] font-semibold uppercase tracking-wider ${
                hasRating ? "text-blue-700/80" : "text-gray-400"
              }`}
            >
              {hasRating ? "Rating" : "No reviews"}
            </span>
          </div>
        </div>

        <div className="space-y-1 text-sm text-gray-600 flex-grow">
          {details.map((item) => (
            <p key={item.label}>
              <span className="font-medium text-gray-800">{item.label}:</span>{" "}
              {item.value}
            </p>
          ))}
        </div>

        <div className="mt-4">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-sm transition-colors"
            onClick={() => onView?.(_id)}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
