import express from 'express';
import userRoutes from './user';
import accountRoutes from './account';
import mediaRoutes from './media';
import tagsRoutes from './tags';

const router = express.Router();	// eslint-disable-line new-cap

/**
* @api {get} /api/v1/health-check Check service health
* @apiVersion 1.0.0
* @apiName health-check
* @apiGroup app
*/
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount account routes at /accounts
router.use('/accounts', accountRoutes);

// mount media routes at /media
router.use('/media', mediaRoutes);

// mount tag routes at /tags
router.use('/tags', tagsRoutes);


export default router;
