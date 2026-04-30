import { Router } from 'express';
import usersRouter from './user/user.route.ts';

const apiRouter = Router();

apiRouter.use('/users', usersRouter);

export default apiRouter;
