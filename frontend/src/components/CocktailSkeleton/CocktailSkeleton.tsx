import { Box, Card, CardContent, Skeleton } from '@mui/material';

const CocktailSkeleton = () => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {Array.from(new Array(3)).map((_, index) => (
        <Card key={index} sx={{ width: 300 }}>
          <Skeleton variant="rectangular" height={200} animation="wave" />

          <CardContent>
            <Skeleton
              variant="text"
              sx={{ fontSize: '1.25rem', mb: 1 }}
              width="80%"
              animation="wave"
            />

            <Skeleton variant="text" width="100%" animation="wave" />
            <Skeleton variant="text" width="90%" animation="wave" />
            <Skeleton variant="text" width="60%" animation="wave" />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default CocktailSkeleton;
