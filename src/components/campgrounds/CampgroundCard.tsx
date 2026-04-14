"use client";

import Image from "next/image";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Campground } from "@/types";

interface CampgroundCardProps {
  campground: Campground;
  onView?: (id: string) => void;
  onBook?: (id: string) => void;
}

export default function CampgroundCard({
  campground,
  onView,
  onBook,
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
    picture,
  } = campground;

  // Refactor: Data mapping to avoid code smell (DRY principle)
  const details = [
    { label: "Address", value: address },
    { label: "District", value: district },
    { label: "Province", value: province },
    { label: "Postal Code", value: postalcode },
    { label: "Tel", value: tel },
  ];

  return (
    <Card hoverable className="overflow-hidden flex flex-col h-full">
      <div
        style={{
          position: "relative",
          height: "200px",
          width: "100%",
          background: "#f3f4f6",
        }}
      >
        <Image
          // src={picture || "/img/campground-placeholder.jpg"}
          src={"/img/campImg.jpg"}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Critical for performance
        />
      </div>

      <div className="flex flex-col flex-grow gap-3 p-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 line-clamp-1">
            {name}
          </h2>
          <p className="mt-1 text-sm text-gray-500 uppercase tracking-wider">
            {region}
          </p>
        </div>

        <div className="space-y-1 text-sm text-gray-600 flex-grow">
          {details.map((item) => (
            <p key={item.label}>
              <span className="font-medium text-gray-800">{item.label}:</span>{" "}
              {item.value}
            </p>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onView?.(_id)}
          >
            View Details
          </Button>

          <Button className="flex-1" onClick={() => onBook?.(_id)}>
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  );
}
