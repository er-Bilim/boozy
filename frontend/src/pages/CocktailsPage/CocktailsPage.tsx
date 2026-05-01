import { useEffect } from 'react';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts';
import {
  selectCocktails,
  selectLoading,
} from '@/features/cocktail/cocktailSelectors.ts';
import { fetchCocktails } from '@/features/cocktail/cocktailThunks.ts';
import { toast } from 'react-toastify';
import CocktailSkeleton from '@/components/CocktailSkeleton/CocktailSkeleton.tsx';

const CocktailsPage = () => {
  const dispatch = useAppDispatch();
  const cocktails = useAppSelector(selectCocktails);
  const loading = useAppSelector(selectLoading).fetchLoading;

  const getImage = (image: string | null) => {
    if (!image) return 'https://via.placeholder.com/300';
    if (image.startsWith('http')) return image;
    return `http://localhost:8000/${image}`;
  };

  const fetchAllCocktails = async () => {
    try {
      await dispatch(fetchCocktails()).unwrap();
    } catch (e) {
      toast.error('Failed to fetch cocktails');
    }
  };

  useEffect(() => {
    void fetchAllCocktails();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Cocktail Gallery
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {loading ? (
          <CocktailSkeleton />
        ) : (
          cocktails
            .filter((c) => c.isPublished)
            .map((cocktail) => (
              <Card key={cocktail._id} sx={{ width: 300 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={getImage(cocktail.image)}
                  alt={cocktail.title}
                />

                <CardContent>
                  <Typography variant="h6">{cocktail.title}</Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {cocktail.recipe}
                  </Typography>
                </CardContent>
              </Card>
            ))
        )}
      </Box>
    </Box>
  );
};

export default CocktailsPage;
