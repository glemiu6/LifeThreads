import { Router } from 'express';
import * as threadsController from '../controllers/threadsController.js';
import {createEntry,listEntriesByThread} from "../controllers/entriesController.js"

const router = Router();

// ---- static routes  ----
router.get('/explore', threadsController.explorePublicThreads);
router.get('/search', threadsController.searchPublicThreads);

// ---- collection routes ----
router.get('/', threadsController.listThreads);
router.post('/', threadsController.cretateThread);

// ---- single thread routes ----
router.get('/:id', threadsController.getThreadById);
router.put('/:id', threadsController.updateThreadInfo);
router.delete('/:id', threadsController.deleteThread);

// ---- sub-resource routes ----
router.put('/:id/visibility', threadsController.updateVisibilityThread);
router.get('/:id/users', threadsController.listThreadsUsers);
router.get('/:id/entries',listEntriesByThread)
router.post('/:id/entries',createEntry)

// ---- member routes (specific before dynamic routes) ----


export default router;