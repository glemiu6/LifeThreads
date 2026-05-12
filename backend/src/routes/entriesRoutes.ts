import { Router } from 'express';
import * as entriesController from '../controllers/entriesController.js';
import * as commentController from '../controllers/commentController.js';
import * as reactionController from '../controllers/reactionController.js';
import * as mediaController from '../controllers/mediaController.js';
import { authGuard } from '../middleware/authGuard.js';

const entryRouter = Router();

// ---- single entry routes ----
entryRouter.get('/:id', entriesController.getEntryById);
entryRouter.put('/:id', entriesController.updateEntryInfo);
entryRouter.delete('/:id', entriesController.deleteEntry);

// ---- entry status routes ----
entryRouter.put('/:id/publish', entriesController.publishEntry);
entryRouter.put('/:id/unpublish', entriesController.unpublishEntry);

// ---- reaction routes ----
entryRouter.post('/:id/react',authGuard, reactionController.reactToEntry);
entryRouter.delete('/:id/react',authGuard, reactionController.removeReaction);

// ---- media routes ----
entryRouter.post('/:id/media', authGuard, mediaController.addMedia);
// ---- comment routes ----
entryRouter.get('/:id/comments', authGuard,commentController.getComment);
entryRouter.post('/:id/comments', authGuard,commentController.createComment);
entryRouter.delete('/comments/:id', authGuard,commentController.deleteComment);


entryRouter.delete('/:id/media/:mediaId', authGuard, mediaController.removeMedia);
export default entryRouter;