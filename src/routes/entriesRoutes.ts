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

// Router para /api/threads/:threadId/entries
// Importante: No teu ficheiro de rotas das Threads ou no index.ts, tens de ligar isto da seguinte forma:
// app.use('/api/threads/:threadId/entries', threadEntriesRouter);
const threadEntriesRouter = Router({ mergeParams: true }); // mergeParams permite aceder ao :threadId

threadEntriesRouter.get('/', entriesController.listEntriesByThread);
threadEntriesRouter.post('/', entriesController.createEntry);


export { entryRouter, threadEntriesRouter };