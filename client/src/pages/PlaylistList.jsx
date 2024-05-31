import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import mediaApi from "../api/modules/media.api";
// import playlistApi from "../api/modules/playlist.api";

const PlaylistList = () => {
  const { user } = useSelector((state) => state.user);
  const [movies, setMovies] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { response, err } = await mediaApi.getList({
          mediaType: "movie",
          mediaCategory: "popular",
          page: 1,
        });
        if (err) {
          toast.error(err.message);
        } else {
          setMovies(response.results);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast.error("Failed to fetch movies");
      }
    };

    fetchMovies();
  }, []);

  const handleCreatePlaylist = async () => {
    // if (!playlistName) {
    //   toast.error("Playlist name is required");
    //   return;
    // }

    // if (!user || !user.id) {
    //   toast.error("User is not authenticated");
    //   return;
    // }

    // try {
    //   const { response, err } = await playlistApi.createPlaylist({
    //     userId: user.id, // Ensure user ID is correctly passed
    //     name: playlistName,
    //     isPublic,
    //   });

    //   if (err) {
    //     toast.error(err.message);
    //   } else {
    //     toast.success("Playlist created successfully");
    //     setPlaylistName("");
    //     setIsPublic(true);
    //     // Optionally update user state or refetch user data to get the updated playlists
    //   }
    // } catch (error) {
    //   console.error("Error creating playlist:", error);
    //   toast.error("Failed to create playlist");
    // }
  };

  const handleAddToPlaylist = async (movie) => {
    // if (!selectedPlaylist) {
    //   toast.error("Please select a playlist first");
    //   return;
    // }

    // if (!user || !user.id) {
    //   toast.error("User is not authenticated");
    //   return;
    // }

    // try {
    //   const { response, err } = await playlistApi.addMovieToPlaylist({
    //     userId: user.id, // Ensure user ID is correctly passed
    //     listId: selectedPlaylist,
    //     movieId: movie.id,
    //   });

    //   if (err) {
    //     toast.error(err.message);
    //   } else {
    //     toast.success(`${movie.title} added to playlist`);
    //   }
    // } catch (error) {
    //   console.error("Error adding movie to playlist:", error);
    //   toast.error("Failed to add movie to playlist");
    // }
  };

  return (
    <Box>
      <Typography variant="h4" mb={2} mt={7}>
        Movies
      </Typography>
      {/* Create Playlist */}
      <Box mb={3}>
        <Typography variant="h6">Create Playlist</Typography>
        <TextField
          label="Playlist Name"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant={isPublic ? "contained" : "outlined"}
          onClick={() => setIsPublic(!isPublic)}
        >
          {isPublic ? "Public" : "Private"}
        </Button>
        <Button onClick={handleCreatePlaylist} variant="contained" color="primary">
          Create Playlist
        </Button>
      </Box>
      {/* Dropdown or selection for playlists */}
      <Box mb={3}>
        <Typography variant="h6">Select Playlist</Typography>
        <select
          value={selectedPlaylist}
          onChange={(e) => setSelectedPlaylist(e.target.value)}
        >
          <option value="" disabled>
            Select a playlist
          </option>
          {user?.movieLists?.map((list) => (
            <option key={list._id} value={list._id}>
              {list.name}
            </option>
          ))}
        </select>
      </Box>
      {movies.length === 0 ? (
        <Typography variant="body1">No movies found.</Typography>
      ) : (
        <Box>
          {movies.map((movie) => (
            <Box key={movie.id} mb={2}>
              <Typography variant="h5">{movie.title}</Typography>
              <Button
                onClick={() => handleAddToPlaylist(movie)}
                variant="outlined"
              >
                Add to Playlist
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PlaylistList;
