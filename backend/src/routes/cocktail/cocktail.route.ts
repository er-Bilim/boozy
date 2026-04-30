import Cocktail from '../../model/cocktail/Cocktail.ts';
import isValidationError from '../../utils/validationError.ts';
import { isValidObjectId } from 'mongoose';
import { Router } from 'express';
import auth, { type RequestWithUser } from '../../middlewares/auth.ts';
import { cocktailUpload } from '../../middlewares/multer.ts';
import deleteImage from '../../utils/deleteImage.ts';

const cocktailsRouter = Router();

cocktailsRouter.get('/', async (_req, res, next) => {
  try {
    const cocktails = await Cocktail.find({ isPublished: true }).populate(
      'user',
      'displayName',
    );
    res.json(cocktails);
  } catch (error) {
    next(error);
  }
});

cocktailsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid Cocktail ID' });
    }

    const cocktail = await Cocktail.findById(id).populate(
      'user',
      'displayName',
    );

    if (!cocktail) {
      return res.status(404).json({ error: 'Cocktail not found' });
    }

    res.json(cocktail);
  } catch (error) {
    next(error);
  }
});

cocktailsRouter.post(
  '/',
  auth,
  cocktailUpload.single('image'),
  async (req, res, next) => {
    const { user } = req as RequestWithUser;

    const cocktailData = {
      user: user._id,
      title: req.body.title,
      recipe: req.body.recipe,
      ingredients: JSON.parse(req.body.ingredients),
      image: req.file ? `uploads/cocktails/${req.file.filename}` : null,
      isPublished: false,
    };

    try {
      const cocktail = new Cocktail(cocktailData);
      await cocktail.save();
      res.json({
        message: 'Cocktail created and awaiting moderation',
        cocktail,
      });
    } catch (error) {
      if (cocktailData.image) await deleteImage({ image: cocktailData.image });

      if (isValidationError(error)) {
        res.status(400).json({ error: isValidationError(error) });
      }

      next(error);
    }
  },
);

export default cocktailsRouter;
