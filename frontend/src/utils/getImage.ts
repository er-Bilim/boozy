import CONTENT_PLACEHOLDER from '@assets/placeholders/content_pl.png';

export const getImage = (image: string | null) => {
  if (image && image.includes('uploads'))
    return `http://localhost:8000/${image}`;
  if (image && image.startsWith('http')) return image;
  return CONTENT_PLACEHOLDER;
};
