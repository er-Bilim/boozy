import { Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import { blue } from '@mui/material/colors';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import FileInput from '@/components/FileInput/FileInput';
import { type ChangeEvent } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaCreateCocktail } from './lib/validation';
import type { ICocktailMutation } from '@/types';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectLoading } from '@/features/cocktail/cocktailSelectors';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { createCocktail } from '@/features/cocktail/cocktailThunks.ts';
import { toast } from 'react-toastify';

const AddCocktailPage = () => {
  const dispatch = useAppDispatch();
  const { createLoading } = useAppSelector(selectLoading);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<ICocktailMutation>({
    resolver: zodResolver(schemaCreateCocktail),
    defaultValues: {
      ingredients: [{ name: '', amount: '' }],
    },
  });

  const onChangeFileHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;

    if (files && files[0] && name === 'image') {
      setValue(name, files[0]);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const onCreateCocktail = async (data: ICocktailMutation) => {
    try {
      await dispatch(createCocktail(data)).unwrap();
      navigate('/');
      toast.success('Your cocktail is under review');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: blue[500],
        }}
      >
        <LocalBarIcon
          sx={{
            fontSize: '60px',
            marginBottom: '15px',
          }}
        />
      </Box>
      <Box
        sx={{
          width: '700px',
          border: `1px solid ${blue[900]}`,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          borderRadius: '22px',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            component="p"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: 10,
              fontWeight: 100,
              fontSize: '1rem',
              color: blue[900],
            }}
          >
            create cocktail
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit(onCreateCocktail)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              id="outlined-basic"
              label="title"
              variant="outlined"
              type="text"
              {...register('title')}
              sx={{
                width: '100%',
              }}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              id="outlined-basic"
              label="recipe"
              variant="outlined"
              type="text"
              multiline
              {...register('recipe')}
              sx={{
                width: '100%',
              }}
              error={!!errors.recipe}
              helperText={errors.recipe?.message}
            />

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {fields.map((field, index) => (
                <Box key={field.id}>
                  <Box
                    key={field.id}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      label="name"
                      variant="outlined"
                      type="text"
                      multiline
                      {...register(`ingredients.${index}.name`)}
                      sx={{
                        width: '40%',
                      }}
                      error={!!errors.ingredients?.[index]?.name}
                      helperText={!!errors.ingredients?.[index]?.name?.message}
                    />
                    <TextField
                      id="outlined-basic"
                      label="amount"
                      variant="outlined"
                      type="text"
                      multiline
                      {...register(`ingredients.${index}.amount`)}
                      sx={{
                        width: '40%',
                      }}
                      error={!!errors.ingredients?.[index]?.amount}
                      helperText={
                        !!errors.ingredients?.[index]?.amount?.message
                      }
                    />
                    {index !== 0 && (
                      <>
                        <Button
                          onClick={() => remove(index)}
                          sx={{
                            border: 1,
                            borderColor: blue[500],
                            mt: 2,
                          }}
                        >
                          <DeleteForeverIcon />
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              ))}
              <Button
                onClick={() => append({ name: '', amount: '' })}
                sx={{
                  width: '100%',
                  border: 1,
                  borderColor: blue[500],
                  mt: 2,
                }}
              >
                add ingredient
              </Button>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                textTransform: 'uppercase',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  letterSpacing: 2,
                  textAlign: 'center',
                }}
              >
                cocktail image
              </Typography>
              <Box
                sx={{
                  width: '50%',
                  overflow: 'hidden',
                  borderColor: blue[500],
                  textAlign: 'center',
                }}
              >
                <FileInput
                  label="Cocktail photo"
                  {...register('image')}
                  onChange={onChangeFileHandler}
                />
                {errors.image && <p>{errors.image.message}</p>}
              </Box>
            </Box>
          </Box>

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              width: '100%',
              background: blue[500],
              letterSpacing: 4,
              padding: '10px 0',
              fontWeight: 100,
              borderRadius: '22px',
            }}
            loading={createLoading}
          >
            create!
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddCocktailPage;
