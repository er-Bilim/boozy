import Cocktail from '../../model/cocktail/Cocktail.ts';
import isValidationError from '../../utils/validationError.ts';
import { isValidObjectId } from 'mongoose';
import { Router } from 'express';
import auth, { type RequestWithUser } from '../../middlewares/auth.ts';
import { cocktailUpload } from '../../middlewares/multer.ts';
import deleteImage from '../../utils/deleteImage.ts';
import permit from '../../middlewares/permit.ts';
import togglePublishedHelper from '../../helpers/togglePublishedHelper.ts';

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

cocktailsRouter.get('/my', auth, async (req, res, next) => {
  try {
    const { user } = req as RequestWithUser;

    const userCocktails = await Cocktail.find({ user: user._id });

    if (userCocktails.length === 0) {
      return null;
    }

    return res.json(userCocktails);
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

    const ratingsCount = cocktail.ratings.length;
    const ratingsSum = cocktail.ratings.reduce((acc, r) => acc + r.score, 0);

    const cocktailObject = {
      ...cocktail.toObject(),
      averageRating:
        ratingsCount > 0 ? Number((ratingsSum / ratingsCount).toFixed(1)) : 0,
      ratingsCount: ratingsCount,
    };

    res.json(cocktailObject);
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

cocktailsRouter.patch(
  '/:id/publish',
  auth,
  permit('admin'),
  async (req, res, next) => {
    try {
      const cocktailID = req.params.id as string;

      if (!isValidObjectId(cocktailID)) {
        return res.status(400).json({ error: 'Invalid Cocktail ID' });
      }

      const updatedCocktail = await togglePublishedHelper(Cocktail, cocktailID);

      if (!updatedCocktail) {
        return res.status(404).json({
          error: 'Cocktail not found',
        });
      }

      return res.json(updatedCocktail);
    } catch (error) {
      next(error);
    }
  },
);

cocktailsRouter.patch('/:id/rate', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { score } = req.body;
    const { user } = req as RequestWithUser;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ error: 'Score must be between 1 and 5' });
    }

    const cocktail = await Cocktail.findById(id);

    if (!cocktail) {
      return res.status(404).json({
        error: 'Cocktail not found',
      });
    }

    if (!cocktail.isPublished) {
      return res.status(403).json({
        error: 'You cannot rate a cocktail that has not been published yet',
      });
    }

    const existingRatingIndex = cocktail.ratings.findIndex(
      (r) => r.userId.toString() === user._id.toString(),
    );

    if (existingRatingIndex !== -1 && cocktail.ratings[existingRatingIndex]) {
      cocktail.ratings[existingRatingIndex].score = score;
    } else {
      cocktail.ratings.push({ userId: user._id, score });
    }

    await cocktail.save();
    res.send(cocktail);
  } catch (error) {
    next(error);
  }
});

cocktailsRouter.delete(
  '/:id/delete',
  auth,
  permit('admin', 'user'),
  async (req, res, next) => {
    try {
      const cocktailID = req.params.id as string;

      if (!isValidObjectId(cocktailID)) {
        return res.status(400).json({ error: 'Invalid Cocktail ID' });
      }

      const { user } = req as RequestWithUser;

      const cocktail = await Cocktail.findById(cocktailID);

      if (!cocktail) {
        return res.status(404).json({ error: 'Cocktail not found' });
      }

      const isAdmin = user.role === 'admin';
      const isOwner = await Cocktail.findOne({ _id: cocktail, user: user._id });

      if (!isAdmin && !isOwner) {
        return res
          .status(403)
          .json({ error: 'You can only delete your own cocktails' });
      }

      await cocktail.deleteOne();
      res.send({ message: 'Deleted successfully' });
    } catch (error) {
      next(error);
    }
  },
);

export default cocktailsRouter;
