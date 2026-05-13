import { Router } from 'express';
import * as threadsController from '../controllers/threadsController.js';
import * as entriesController from '../controllers/entriesController.js';
import * as invitesController from '../controllers/inviteController.js';
import * as membershipsController from '../controllers/membershipController.js';
import { authGuard } from '../middleware/authGuard.js';

const router = Router();

// ── Static routes (MUST be before /:id) ───────────────────────────────────────
router.get('/explore',                    threadsController.explorePublicThreads);
router.get('/search',                     threadsController.searchPublicThreads);
router.get('/summary',          authGuard, entriesController.getMonthlySummary);  // ?year=&month=

// ── Collection ────────────────────────────────────────────────────────────────
router.get('/',                 authGuard, threadsController.listThreadsUsers);
router.post('/',                authGuard, threadsController.cretateThread);

// ── Single thread ─────────────────────────────────────────────────────────────
router.get('/:id',              authGuard, threadsController.getThreadById);
router.put('/:id',              authGuard, threadsController.updateThreadInfo);
router.delete('/:id',           authGuard, threadsController.deleteThread);

// ── Thread sub-resources ──────────────────────────────────────────────────────
router.put('/:id/visibility',   authGuard, threadsController.updateVisibilityThread);
router.get('/:id/summary',      authGuard, entriesController.getThreadSummary);   // AI summary
router.get('/:id/entries',      authGuard, entriesController.listEntriesByThread);
router.post('/:id/entries',     authGuard, entriesController.createEntry);

// ── Members ───────────────────────────────────────────────────────────────────
router.get('/:id/members',              authGuard, membershipsController.listThreadsMembers);
router.delete('/:id/members',           authGuard, membershipsController.removeSelfFromThread);
router.put('/:id/members/:userId',      authGuard, membershipsController.updateMemberRole);
router.delete('/:id/members/:userId',   authGuard, membershipsController.removeMember);

// ── Invites ───────────────────────────────────────────────────────────────────
router.post('/:id/invites',             authGuard, invitesController.inviteUserToThread);
router.put('/invites/:id/response',     authGuard, invitesController.respondToInvite);

export default router;