import { useState } from 'react';
import { apiClient } from '../api/apiClient';
import { Campground } from '../types';

// Tip: Keep this outside the hook so it's not recreated on every render
const FEATURED_IMAGES: Record<string, string> = {
  "69a56de72fd476ffa1e39f36": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4", 
  "69a70cc82d8a300eb13d8940": "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7",
  "69a32570c4de126ee4fead04": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d",
  "69a70bc911e15e94e2ac873d": "https://images.unsplash.com/photo-1496080174650-637e3f22fa03",
  "69a6f0cd27b04368b4ca0fbc": "https://images.unsplash.com/photo-1517824806704-9040b037703b",
};

export const useCampgrounds = () => {
  const [campgrounds, setCampgrounds] = useState<Campground[]>([]);
  const [singleCampground, setSingleCampground] = useState<Campground | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to resolve the image logic
  const resolveImage = (camp: Campground) => {
    if (FEATURED_IMAGES[camp._id]) return FEATURED_IMAGES[camp._id];
    
    // If it's a placeholder or missing, use a seeded random image
    if (!camp.picture || camp.picture.includes('placeholder')) {
      return `https://picsum.photos/seed/${camp._id}/1000/600`;
    }
    return camp.picture;
  };

  const getCampgrounds = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient('/campgrounds');
      // Apply the image logic to the list
      const enrichedData = data.data.map((camp: Campground) => ({
        ...camp,
        picture: resolveImage(camp)
      }));
      setCampgrounds(enrichedData);
    } catch (err) {
      setError("Failed to load campgrounds");
    } finally {
      setLoading(false);
    }
  };

  const getCampgroundById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient(`/campgrounds/${id}`);
      // Apply image logic to the single item
      setSingleCampground({
        ...data.data,
        picture: resolveImage(data.data)
      });
    } catch (err) {
      setError("Failed to load campground details");
    } finally {
      setLoading(false);
    }
  };

  return { campgrounds, singleCampground, getCampgrounds, getCampgroundById, loading, error };
};