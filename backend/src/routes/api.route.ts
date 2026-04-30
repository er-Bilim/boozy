import { Router } from 'express';
import usersRouter from './user/user.route.ts';
import cocktailsRouter from './cocktail/cocktail.route.ts';

const apiRouter = Router();

apiRouter.use('/users', usersRouter);
apiRouter.use('/cocktails', cocktailsRouter);

export default apiRouter;
