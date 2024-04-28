// Routes pour la gestion des sessions

import express from 'express';
import { createSession, getLatestSession, getUserSessions } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/', createSession);
router.get('/latest', getLatestSession);
router.get('/user', getUserSessions);

export default router;
