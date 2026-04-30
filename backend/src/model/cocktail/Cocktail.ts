import { Schema, model } from 'mongoose';
import type { IIngredient } from '../../types/cocktail/cocktail.types.js';

const CocktailSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  recipe: {
    type: String,
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
    required: true,
  },
  ingredients: {
    type: [
      {
        name: { type: String, required: true },
        amount: { type: String, required: true },
      },
    ],
    required: [true, 'Ingredients are required'],
    validate: {
      validator: function (v: IIngredient[]) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'Cocktail must have at least one ingredient',
    },
  },
  ratings: {
    type: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        score: { type: Number, required: true, min: 1, max: 5 },
      },
    ],
    default: [],
  },
});

const Cocktail = model('Cocktail', CocktailSchema);

export default Cocktail;
