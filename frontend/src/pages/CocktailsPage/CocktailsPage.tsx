import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import axiosApi from '@/api/axiosApi';

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

const CocktailsPage = () => {
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
      title: 'Berry Fresh',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800',
      recipe: 'Fresh berry drink with ice and mint.',
      isPublished: true,
      ingredients: [
        { name: 'Berries', amount: '100 g' },
        { name: 'Ice', amount: '4 cubes' },
      ],
    },
  ]);

  useEffect(() => {
    const fetchCocktails = async () => {
      try {
        const response = await axiosApi.get<Cocktail[]>('/cocktails');

        if (response.data.length > 0) {
          setCocktails(response.data);
        }
      } catch (e) {
        console.log(e);
      }
    };

    void fetchCocktails();
  }, []);

  const getImage = (image: string | null) => {
    if (!image) return 'https://via.placeholder.com/300';
    if (image.startsWith('http')) return image;
    return `http://localhost:8000/${image}`;
  };

  return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Cocktail Gallery
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {cocktails
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
              ))}
        </Box>
      </Box>
  );
};

export default CocktailsPage;