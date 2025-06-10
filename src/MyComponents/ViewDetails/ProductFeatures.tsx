import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
  "https://i.pinimg.com/originals/64/1e/f7/641ef7fe4ef28cb13e2bd491e8f049c6.jpg",
  "https://m.media-amazon.com/images/I/618MwWZziYL.jpg",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
];

const ExpandableGallery = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="bg-white shadow-md p-4 w-full max-w-full mx-auto">
         <h1 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">
         Product Features

      </h1>
      <div
        className={`relative overflow-hidden transition-all duration-500 ${
          expanded ? "h-auto" : "h-[500px]" // Set a specific height for the collapsed view
        } bg-black`}
      >
        <div className="space-y-3 p-2">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`img-${idx}`}
              className={`rounded-md transition-transform transform ${
                idx === 0
                  ? "object-cover w-5/6 mx-auto h-[500px]" // Set height for the first image
                  : "object-contain h-[500px] mx-auto" // Set height for subsequent images
              }`}
            />
          ))}
        </div>

        {/* Smaller white gradient overlay for the first image when collapsed */}
        {!expanded && (
          <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      <CardContent className="text-center mt-4">
        <Button onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show Less" : "View full Product Features"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExpandableGallery;
