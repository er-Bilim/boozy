import type { RootState } from '@/app/store';

export const selectLoading = (state: RootState) => state.cocktail.loading;
export const selectError = (state: RootState) => state.cocktail.errors;
