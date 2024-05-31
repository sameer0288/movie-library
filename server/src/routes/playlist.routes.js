import express from "express";
import { createPlaylist, addMovieToPlaylist, getUserPlaylists } from "../controllers/playlist.controller.js";


const router = express.Router();

router.post("/create", createPlaylist);
router.post("/add", addMovieToPlaylist);
router.get("/users/:userId/playlists",  getUserPlaylists);

export default router;
