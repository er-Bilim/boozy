import type { RootState } from '@/app/store';

export const selectLoading = (state: RootState) => state.cocktail.loading;
export const selectError = (state: RootState) => state.cocktail.errors;
export const selectCocktails = (state: RootState) => state.cocktail.cocktails;
export const selectSelectedCocktail = (state: RootState) => state.cocktail.selectedCocktail;
