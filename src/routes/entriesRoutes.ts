import { Router } from 'express';
import * as entriesController from '../controllers/entriesController.js';

const entryRouter = Router();

// ---- single entry routes ----
entryRouter.get('/:id', entriesController.getEntryById);
entryRouter.put('/:id', entriesController.updateEntryInfo);
entryRouter.delete('/:id', entriesController.deleteEntry);

// ---- entry status routes ----
entryRouter.put('/:id/publish', entriesController.publishEntry);
entryRouter.put('/:id/unpublish', entriesController.unpublishEntry);

export default entryRouter;