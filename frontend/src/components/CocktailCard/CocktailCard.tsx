import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts';
import { selectUser } from '@/features/users/usersSlice.ts';
import { getImage } from '@/utils/getImage.ts';
import React, { useState } from 'react';
import {
  deleteCocktail,
  publishCocktail,
} from '@/features/cocktail/cocktailThunks';
import { toast } from 'react-toastify';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog.tsx';
import { Link } from 'react-router-dom';

interface Props {
  id: string;
  title: string;
  image: string | null;
  isPublished: boolean;
  recipe: string;
  userId: string;
}

const CocktailCard: React.FC<Props> = ({
  id,
  title,
  image,
  recipe,
  isPublished,
  userId,
}) => {
  const user = useAppSelector(selectUser);
  const isAdmin = user?.role === 'admin';
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    try {
      await dispatch(deleteCocktail(id)).unwrap();
    } catch (e) {
      toast.error('Failed to delete cocktail');
    }
  };

  const handlePublish = async () => {
    try {
      await dispatch(publishCocktail(id)).unwrap();
    } catch (e) {
      toast.error('Failed to publish cocktail');
    }
  };

  return (
    <>
      <Card
        sx={{
          width: 300,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {!isPublished && (
          <Chip
            label="Unpublished"
            color="primary"
            size="small"
            sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
          />
        )}

        <CardMedia
          component="img"
          height="200"
          image={getImage(image)}
          alt={title}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {recipe}
          </Typography>
        </CardContent>

        <CardActions
            sx={{
              justifyContent: 'space-between',
              borderTop: '1px solid #eee',
              p: 1,
            }}
        >
          <Box>
            {!isPublished && isAdmin && (
                <Button
                    variant="outlined"
                    size="small"
                    color="success"
                    onClick={handlePublish}
                >
                  Publish
                </Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {(isAdmin || user?._id === userId) && (
                <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => setConfirmOpen(true)}
                >
                  Delete
                </Button>
            )}

            <Button component={Link} to={`/cocktails/${id}`} size="small">
              Details
            </Button>
          </Box>
        </CardActions>
      </Card>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete cocktail?"
        message={`Are you sure you want to delete the ${title}?`}
      />
    </>
  );
};

export default CocktailCard;
