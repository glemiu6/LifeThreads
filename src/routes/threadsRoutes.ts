import { Router } from "express";
import * as threadsController from '../controllers/threadsController.js';

const router = Router();

router.post('/',threadsController.cretateThread);

export default router;