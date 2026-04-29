export interface User {
    _id: string;
    email: string;
    displayName: string;
    avatar: string | null;
    role: 'user' | 'admin';
}

export interface Ingredient {
    name: string;
    amount: string;
}

export interface Rating {
    userId: string;
    score: number;
}

export interface Cocktail {
    _id: string;
    user: string | User;
    title: string;
    image: string | null;
    recipe: string;
    isPublished: boolean;
    ingredients: Ingredient[];
    ratings: Rating[];
}