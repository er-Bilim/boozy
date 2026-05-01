export interface User {
  _id: string;
  email: string;
  displayName: string;
  avatar: string | null;
  role: 'user' | 'admin';
}

export interface ICocktailMutation {
  title: string;
  ingredients: Ingredient[];
  recipe: string;
  image?: File | null;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Rating {
  userId: string;
  score: number;
}

export interface ICocktail {
  _id: string;
  user: string | User;
  title: string;
  image: string | null;
  recipe: string;
  isPublished: boolean;
  ingredients: Ingredient[];
  ratings: Rating[];
}
export interface LoginMutation {
  email: string;
  password: string;
}

export interface RegisterMutation {
  email: string;
  password: string;
  displayName: string;
  avatar?: File | null;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface IGlobalError {
  error: string;
}

export interface IValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}

export interface ICocktailDetails extends ICocktail {
  averageRating: number;
  ratingsCount: number;
}
