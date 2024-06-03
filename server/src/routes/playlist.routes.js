// routes/playlist.routes.js

import express from "express";
import { createPlaylist, addMovieToPlaylist, getUserPlaylists, getPlaylistDetails } from "../controllers/playlist.controller.js";

const router = express.Router();

router.post("/create", createPlaylist);
router.post("/add", addMovieToPlaylist);
router.get("/users/:userId/playlists", getUserPlaylists);
router.get("/details/:id", getPlaylistDetails); // New route to get playlist details

export default router;
