import { Router } from 'express';
import * as threadsController from '../controllers/threadsController.js';
import {createEntry,listEntriesByThread} from "../controllers/entriesController.js"
import { authGuard } from '../middleware/authGuard.js';
import * as invitesController from '../controllers/inviteController.js';
import * as membershipsController from '../controllers/membershipController.js';

const router = Router();

// ---- static routes  ----
router.get('/explore', threadsController.explorePublicThreads);
router.get('/search', threadsController.searchPublicThreads);

// ---- collection routes ----
router.get('/', authGuard,threadsController.listThreadsUsers);
router.post('/', authGuard,threadsController.cretateThread);

// ---- single thread routes ----
router.get('/:id', authGuard,threadsController.getThreadById);
router.put('/:id', authGuard,threadsController.updateThreadInfo);
router.delete('/:id', authGuard,threadsController.deleteThread);

// ---- sub-resource routes ----
router.put('/:id/visibility', authGuard,threadsController.updateVisibilityThread);
router.get('/:id/entries',authGuard,listEntriesByThread)
router.post('/:id/entries',authGuard,createEntry)
router.post('/:id/invite', authGuard, invitesController.inviteUserToThread);
router.put('/invites/:id/respond', authGuard, invitesController.respondToInvite);
router.get('/:id/members', authGuard, membershipsController.listThreadsMembers);
router.delete('/:id/members', authGuard, membershipsController.removeSelfFromThread);


router.put('/:id/members/:userId', authGuard, membershipsController.updateMemberRole);
router.delete('/:id/members/:userId', authGuard, membershipsController.removeMember);



export default router;