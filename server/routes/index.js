import express from 'express';
import userRoutes from './user';
import accountRoutes from './account';
import mediaRoutes from './media';

const router = express.Router();	// eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount account routes at /accounts
router.use('/accounts', accountRoutes);

// mount media routes at /media
router.use('/media', mediaRoutes);


export default router;
