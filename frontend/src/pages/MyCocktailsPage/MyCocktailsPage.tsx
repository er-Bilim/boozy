import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectCocktails,
  selectLoading,
} from '@/features/cocktail/cocktailSelectors.ts';
import { toast } from 'react-toastify';
import { fetchMyCocktails } from '@/features/cocktail/cocktailThunks.ts';
import CocktailSkeleton from '@/components/CocktailSkeleton/CocktailSkeleton.tsx';
import CocktailCard from '@/components/CocktailCard/CocktailCard.tsx';

const MyCocktailsPage = () => {
  const dispatch = useAppDispatch();
  const cocktails = useAppSelector(selectCocktails);
  const loading = useAppSelector(selectLoading).fetchLoading;

  const fetchAllCocktails = async () => {
    try {
      await dispatch(fetchMyCocktails()).unwrap();
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
        My Cocktails
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {loading ? (
          <CocktailSkeleton />
        ) : (
          cocktails.map((cocktail) => (
            <CocktailCard
              key={cocktail._id}
              isPublished={cocktail.isPublished}
              title={cocktail.title}
              recipe={cocktail.recipe}
              image={cocktail.image}
              id={cocktail._id}
            />
          ))
        )}
        {!loading &&
          cocktails.length === 0 &&
          'There are no cocktails yet. Be the first to add a recipe!'}
      </Box>
    </Box>
  );
};

export default MyCocktailsPage;
