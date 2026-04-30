import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@mui/material';
import axiosApi from '@/api/axiosApi';
import { useAppSelector } from '@/app/hooks';

interface Ingredient {
  name: string;
  amount: string;
}

interface Cocktail {
  _id: string;
  title: string;
  image: string | null;
  recipe: string;
  isPublished: boolean;
  ingredients: Ingredient[];
}

const MyCocktailsPage = () => {
  const user = useAppSelector((state) => state.users.user);
  const [cocktails, setCocktails] = useState<Cocktail[]>([
    {
      _id: '1',
      title: 'Mojito',
      image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800',
      recipe: 'Refreshing cocktail with mint, lime and ice.',
      isPublished: true,
      ingredients: [
        { name: 'Mint', amount: '8 leaves' },
        { name: 'Lime', amount: '1 piece' },
      ],
    },
    {
      _id: '2',
      title: 'Lemon Mix',
      image: 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=800',
      recipe: 'Refreshing lemon drink.',
      isPublished: false,
      ingredients: [
        { name: 'Lemon', amount: '1 piece' },
        { name: 'Water', amount: '200 ml' },
      ],
    },
  ]);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchMyCocktails = async () => {
      try {
        const response = await axiosApi.get<Cocktail[]>('/cocktails/my');
        setCocktails(response.data);
      } catch (e) {
        console.log(e);
      }
    };

    void fetchMyCocktails();
  }, []);

  const getImage = (image: string | null) => {
    if (!image) return 'https://via.placeholder.com/300';
    if (image.startsWith('http')) return image;
    return `http://localhost:8000/${image}`;
  };

  return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          My Cocktails
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {cocktails.map((cocktail) => (
              <Card key={cocktail._id} sx={{ width: 300 }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={getImage(cocktail.image)}
                    alt={cocktail.title}
                />

                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">{cocktail.title}</Typography>

                    {!cocktail.isPublished && (
                        <Chip label="На модерации" color="warning" size="small" />
                    )}
                  </Box>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {cocktail.recipe}
                  </Typography>

                  {isAdmin && (
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        {!cocktail.isPublished && (
                            <Button variant="contained" size="small">
                              Опубликовать
                            </Button>
                        )}

                        <Button variant="contained" color="error" size="small">
                          Удалить
                        </Button>
                      </Box>
                  )}
                </CardContent>
              </Card>
          ))}
        </Box>
      </Box>
  );
};

export default MyCocktailsPage;