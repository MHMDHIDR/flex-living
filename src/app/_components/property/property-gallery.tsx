import { Button } from "@/components/ui/button";
import { Grid, Eye } from "lucide-react";

interface PropertyGalleryProps {
  property: {
    id: string;
    name: string;
    city?: string | null;
  };
}

export function PropertyGallery({ property }: PropertyGalleryProps) {
  // Mock gallery images - in production, these would come from the property data
  const galleryImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      alt: "Living room area",
      isMain: true,
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      alt: "Bedroom",
      isMain: false,
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=400&h=300&fit=crop",
      alt: "Kitchen",
      isMain: false,
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop",
      alt: "Bathroom",
      isMain: false,
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop",
      alt: "Reading area",
      isMain: false,
    },
  ];

  const mainImage =
    galleryImages.find((img) => img.isMain) || galleryImages[0]!;
  const thumbnailImages = galleryImages
    .filter((img) => !img.isMain)
    .slice(0, 4);

  return (
    <div className="relative">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 gap-2 overflow-hidden rounded-xl md:grid-cols-4">
        {/* Main Image */}
        <div className="md:col-span-2 md:row-span-2">
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full">
            <img
              src={mainImage.url}
              alt={mainImage.alt}
              className="h-full w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Thumbnail Images */}
        {thumbnailImages.map((image, index) => (
          <div key={image.id} className="relative">
            <div className="aspect-[4/3]">
              <img
                src={image.url}
                alt={image.alt}
                className="h-full w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-105"
              />
              {/* Show "View all photos" overlay on last thumbnail */}
              {index === thumbnailImages.length - 1 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <Grid className="mr-2 h-4 w-4" />
                    View all photos
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View All Photos Button - Mobile */}
      <div className="absolute right-4 bottom-4 md:hidden">
        <Button
          size="sm"
          className="bg-white text-gray-900 shadow-lg hover:bg-gray-50"
        >
          <Eye className="mr-2 h-4 w-4" />
          View all photos
        </Button>
      </div>
    </div>
  );
}
