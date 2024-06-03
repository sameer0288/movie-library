import { Box, Card, CardContent, Typography, Grid, Button, Stack,TextField,FormControlLabel,Checkbox,InputLabel,Select,MenuItem,FormControl } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from '@mui/icons-material/Share'; // Import the Share icon
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import mediaApi from "../api/modules/media.api";
import playlistApi from "../api/modules/playlist.api";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { removeFavorite } from "../redux/features/userSlice";
import { styled } from '@mui/system';
import { Link } from "react-router-dom";
import CircularRate from "../components/common/CircularRate";
import tmdbConfigs from "../api/configs/tmdb.configs";
import uiConfigs from "../configs/ui.configs";
import { routesGen } from "./../routes/routes";

const MovieCard = styled(Card)({
  position: 'relative',
  width: 500,
  margin: 8,
  // border:"1px solid red",

  '&:hover .details': {
    opacity: 1,
  },
});

const MoviePoster = styled(Box)(({ theme }) => ({
  position: 'relative',
  // border:"1px solid red",
  width: '100%',
  paddingTop: '160%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  "&:hover .media-info": { opacity: 1, bottom: 0 },
  "&:hover .media-back-drop, &:hover .media-play-btn": { opacity: 1 },
  color: theme.palette.primary.contrastText,
}));

const MovieDetails = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 0.3s',
  padding: 16,
});

const PlaylistItem = ({ playlist, onRemoved }) => {
  const dispatch = useDispatch();
  const [onRequest, setOnRequest] = useState(false);

  const handleRemovePlaylist = async () => {
    if (onRequest) return;
    setOnRequest(true);
    const { response, err } = await playlistApi.removePlaylist(playlist._id);
    setOnRequest(false);

    if (err) {
      toast.error(err.message);
    } else {
      toast.success("Playlist removed successfully");
      
      onRemoved(playlist._id);
    }
  };

  const handleSharePlaylist = () => {
    // console.log(playlist.id)
    const playlistUrl = `${window.location.origin}/playlist/${playlist.id}`;
    navigator.clipboard.writeText(playlistUrl).then(() => {
      toast.success("Playlist URL copied to clipboard");
    }).catch(err => {
      toast.error("Failed to copy playlist URL");
    });
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h3" color={"red"}>{playlist.name}</Typography>
        <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
          {playlist.isPublic ? <><PublicIcon fontSize="small" sx={{ mr: 1 }} />Public</>: <><LockIcon fontSize="small" sx={{ mr: 1 }} />Private</>}
        </Typography>
        {!playlist.movies || playlist.movies.length === 0 ? (
          <Typography variant="body1">No movies in this playlist.</Typography>
        ) : (
          <Box display="flex" flexWrap="wrap" mt={2}>
            {playlist.movies.map((movie) => (
              <MovieCard key={movie.mediaId}>
                <Link to={routesGen.mediaDetail('movie', movie.mediaId)}>
                  <MoviePoster sx={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.mediaPoster})` }}>
                    <Box className="media-back-drop" sx={{
                      opacity: { xs: 1, md: 0 },
                      transition: "all 0.3s ease",
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      backgroundImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))"
                    }} />
                    <Button
                      className="media-play-btn"
                      variant="contained"
                      startIcon={<PlayArrowIcon />}
                      sx={{
                        display: { xs: "none", md: "flex" },
                        opacity: 0,
                        transition: "all 0.3s ease",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        "& .MuiButton-startIcon": { marginRight: "-4px" }
                      }}
                    />
                    <Box
                      className="media-info"
                      sx={{
                        transition: "all 0.3s ease",
                        opacity: { xs: 1, md: 0 },
                        position: "absolute",
                        bottom: { xs: 0, md: "-20px" },
                        width: "100%",
                        height: "max-content",
                        boxSizing: "border-box",
                        padding: { xs: "10px", md: "2rem 1rem" }
                      }}
                    >
                      <Stack spacing={{ xs: 1, md: 2 }}>
                        {movie.mediaRate && <CircularRate value={movie.mediaRate} />}

                        <Typography>{movie.releaseDate}</Typography>

                        <Typography
                          variant="body1"
                          fontWeight="700"
                          sx={{
                            fontSize: "1rem",
                            ...uiConfigs.style.typoLines(1, "left")
                          }}
                        >
                          {movie.mediaTitle}
                        </Typography>
                      </Stack>
                    </Box>
                  </MoviePoster>
                </Link>
              </MovieCard>
            ))}
          </Box>
        )}
        {playlist.isPublic && (
          <Button
            fullWidth
            variant="outlined"
            sx={{ marginTop: 2 }}
            startIcon={<ShareIcon />}
            onClick={handleSharePlaylist}
          >
            Share Playlist
          </Button>
        )}
        <LoadingButton
          fullWidth
          variant="contained"
          sx={{ marginTop: 2 }}
          startIcon={<DeleteIcon />}
          loadingPosition="start"
          loading={onRequest}
          onClick={handleRemovePlaylist}
        >
          Remove Playlist
        </LoadingButton>
      </CardContent>
    </Card>
  );
};

const PlaylistList = () => {
  const { user } = useSelector((state) => state.user);
  const [movies, setMovies] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const skip = 8;

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

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user || !user.id) return;

      try {
        const { response, error } = await playlistApi.getUserPlaylists(user.id);
        if (error) {
          toast.error(error.message);
        } else {
          setPlaylists(response);
          setCount(response.length);
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
        toast.error("Failed to fetch playlists");
      }
    };

    fetchPlaylists();
  }, [user]);

  const handleCreatePlaylist = async () => {
    if (!playlistName) {
      toast.error("Playlist name is required");
      return;
    }

    if (!user || !user.id) {
      toast.error("User is not authenticated");
      return;
    }
    try {
      const { response, error } = await playlistApi.createPlaylist({
        userId: user.id,
        name: playlistName,
        isPublic,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Playlist created successfully");
        setPlaylistName("");
        setIsPublic(true);
        setPlaylists((prevPlaylists) => [...prevPlaylists, response.data]);
        setCount(count + 1);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      toast.error("Failed to create playlist");
    }
  };

  const handleAddToPlaylist = async (movie) => {
    if (!selectedPlaylist) {
      toast.error("Please select a playlist first");
      return;
    }

    if (!user || !user.id) {
      toast.error("User is not authenticated");
      return;
    }

    try {
      const { response, error } = await playlistApi.addMovieToPlaylist({
        userId: user.id,
        listId: selectedPlaylist,
        mediaId: movie.id,
        mediaType: "movie",
        mediaTitle: movie.title,
        mediaPoster: movie.poster_path,
        mediaRate: movie.vote_average,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(`${movie.title} added to playlist`);
        setPlaylists((prevPlaylists) =>
          prevPlaylists.map((playlist) =>
            playlist._id === selectedPlaylist ? { ...playlist, movies: [...playlist.movies, movie] } : playlist
          )
        );
      }
    } catch (error) {
      console.error("Error adding movie to playlist:", error);
      toast.error("Failed to add movie to playlist");
    }
  };

  const handleRemovePlaylist = (id) => {
    const newPlaylists = playlists.filter((playlist) => playlist._id !== id);
    setPlaylists(newPlaylists);
    setCount(newPlaylists.length);
  };

  return (
    <Box p={3}>
      <Box mt={5}>
        <Typography variant="h4" mb={2}>
          Your Playlists ({count})
        </Typography>
        {playlists.length === 0 ? (
          <Typography variant="body1">No playlists found.</Typography>
        ) : (
          <Grid container spacing={2}>
            {playlists.map((playlist) => (
              <Grid item xs={12} sm={6} md={4} key={playlist._id}>
                <PlaylistItem playlist={playlist} onRemoved={handleRemovePlaylist} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
   
    </Box>
  );
};

export default PlaylistList;

   
