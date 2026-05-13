import { Router } from 'express';
import * as entriesController from '../controllers/entriesController.js';
import { authGuard } from '../middleware/authGuard.js';
import * as mediaController from '../controllers/mediaController.js';
import * as commentsController from '../controllers/commentController.js'
import * as reactionsController from '../controllers/reactionController.js'

const entryRouter = Router();

// ── AI static routes (MUST be before /:id) ────────────────────────────────────
entryRouter.post('/search',               authGuard, entriesController.searchEntries);
entryRouter.post('/draft',                authGuard, entriesController.generateEntryDraft);

// ── Single entry CRUD ─────────────────────────────────────────────────────────
entryRouter.get('/:id',                   authGuard, entriesController.getEntryById);
entryRouter.put('/:id',                   authGuard, entriesController.updateEntryInfo);
entryRouter.delete('/:id',               authGuard, entriesController.deleteEntry);

// ── Entry status ──────────────────────────────────────────────────────────────
entryRouter.put('/:id/status',            authGuard, entriesController.updateStatus);

// ── Tags (AI) ─────────────────────────────────────────────────────────────────
entryRouter.post('/:id/tags',             authGuard, entriesController.tagEntry);

// ── Media ─────────────────────────────────────────────────────────────────────
entryRouter.post('/:id/media',            authGuard, mediaController.addMedia);
entryRouter.delete('/:id/media/:mediaId', authGuard, mediaController.removeMedia);

// ── Comments ──────────────────────────────────────────────────────────────────
entryRouter.get('/:id/comments',                 authGuard, commentsController.getComment);
entryRouter.post('/:id/comments',                authGuard, commentsController.createComment);
entryRouter.delete('/:id/comments/:commentId',   authGuard, commentsController.deleteComment);

// ── Reactions ─────────────────────────────────────────────────────────────────
entryRouter.post('/:id/reactions',        authGuard, reactionsController.reactToEntry);
entryRouter.delete('/:id/reactions',      authGuard, reactionsController.removeReaction);

export default entryRouter;