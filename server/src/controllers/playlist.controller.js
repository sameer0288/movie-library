import Playlist from "../models/playlistSchema.js";
import User from "../models/user.model.js";

export const createPlaylist = async (req, res) => {
  const { userId, name, isPublic } = req.body;
// console.log(req.body);
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const playlist = new Playlist({ user: userId, name, isPublic });
    await playlist.save();

    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMovieToPlaylist = async (req, res) => {
    const { userId, listId, mediaId, mediaType, mediaTitle, mediaPoster, mediaRate } = req.body;
  
    try {
      const playlist = await Playlist.findOne({ _id: listId, user: userId });
      if (!playlist) return res.status(404).json({ message: "Playlist not found" });
  
      // Add movie details to the playlist
      const movie = {
        mediaType,
        mediaId: mediaId.toString(), // Ensure mediaId is always a string
        mediaTitle,
        mediaPoster,
        mediaRate
      };
      playlist.movies.push(movie);
      await playlist.save();
  
      // Log the added movie details
      console.log(`Added movie "${mediaTitle}" to playlist with ID ${listId}`);
  
      res.status(200).json(playlist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  

export const getUserPlaylists = async (req, res) => {
  const { userId } = req.params;
// console.log(userId)
  try {
    const playlists = await Playlist.find({ user: userId });
    if (!playlists) return res.status(404).json({ message: "Playlists not found" });
    //  console.log(playlists);
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlaylistDetails = async (req, res) => {
  const { id } = req.params;
// console.log(id);


  try {
    // Fetch playlist details based on the playlist ID
    const playlist = await Playlist.findById(id);
    // console.log(playlist);

    // Check if playlist exists
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Return playlist details as JSON response
    res.status(200).json(playlist);
  } catch (error) {
    // Handle errors
    console.error("Error fetching playlist details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



