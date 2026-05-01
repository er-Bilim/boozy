import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  Rating,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts';
import {
  fetchCocktailById,
  rateCocktail,
} from '@/features/cocktail/cocktailThunks.ts';
import {
  selectLoading,
  selectSelectedCocktail,
} from '@/features/cocktail/cocktailSelectors.ts';
import { selectUser } from '@/features/users/usersSlice.ts';
import { getImage } from '@/utils/getImage.ts';

const CocktailDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const cocktail = useAppSelector(selectSelectedCocktail);
  const loading = useAppSelector(selectLoading);
  const user = useAppSelector(selectUser);

  const userRating =
      user && cocktail
          ? cocktail.ratings.find((rating) => rating.userId === user._id)?.score || 0
          : 0;

  useEffect(() => {
    if (id) {
      void dispatch(fetchCocktailById(id));
    }
  }, [dispatch, id]);

  const handleRatingChange = async (_: unknown, value: number | null) => {
    if (!id || !value) return;

    if (!user) {
      toast.error('You need to login to rate cocktails');
      return;
    }

    try {
      await dispatch(rateCocktail({ id, score: value })).unwrap();
      await dispatch(fetchCocktailById(id)).unwrap();
      toast.success('Rating saved');
    } catch {
      toast.error('Failed to rate cocktail');
    }
  };

  if (loading.fetchLoading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
    );
  }

  if (!cocktail) {
    return (
        <Typography variant="h5" sx={{ mt: 4 }}>
          Cocktail not found
        </Typography>
    );
  }

  return (
      <Box sx={{ p: 3 }}>
        <Card sx={{ display: 'flex', gap: 3, p: 2 }}>
          <CardMedia
              component="img"
              image={getImage(cocktail.image)}
              alt={cocktail.title}
              sx={{
                width: 380,
                height: 380,
                objectFit: 'cover',
                borderRadius: 2,
              }}
          />

          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h4">{cocktail.title}</Typography>

              {!cocktail.isPublished && (
                  <Chip label="На модерации" color="warning" size="small" />
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Rating
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Rating
                    value={userRating}
                    onChange={handleRatingChange}
                    disabled={loading.rateLoading}
                />

                <Typography color="text.secondary">
                  {cocktail.averageRating} / 5 ({cocktail.ratingsCount} votes)
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" sx={{ mb: 1 }}>
              Ingredients
            </Typography>

            <Box component="ul" sx={{ pl: 3, mb: 3 }}>
              {cocktail.ingredients.map((ingredient, index) => (
                  <li key={`${ingredient.name}-${index}`}>
                    <Typography>
                      {ingredient.name} — {ingredient.amount}
                    </Typography>
                  </li>
              ))}
            </Box>

            <Typography variant="h6" sx={{ mb: 1 }}>
              Recipe
            </Typography>

            <Typography>{cocktail.recipe}</Typography>
          </CardContent>
        </Card>
      </Box>
  );
};

export default CocktailDetailsPage;