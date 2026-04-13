import { Router } from "express";
import * as threadsController from '../controllers/threadsController.js';

const router = Router();

router.post('/',threadsController.cretateThread);
router.get('/',threadsController.listThreads)
router.get('/:id',threadsController.listThreadsUsers)

export default router;