import { Router } from 'express';
import * as entriesController from '../controllers/entriesController.js';

// Router para /api/entries
const entryRouter = Router();

// ---- single entry routes ----
entryRouter.get('/:id', entriesController.getEntryById);
entryRouter.put('/:id', entriesController.updateEntryInfo);
entryRouter.delete('/:id', entriesController.deleteEntry);

// ---- entry status routes ----
entryRouter.post('/:id/publish', entriesController.publishEntry);
entryRouter.post('/:id/unpublish', entriesController.unpublishEntry);

// ======================================================= //

export default  entryRouter ;