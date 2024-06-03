import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import mediaApi from '../api/modules/media.api';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import { toast } from 'react-toastify';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CircularRate from '../components/common/CircularRate';
import tmdbConfigs from '../api/configs/tmdb.configs';
import { styled } from '@mui/system';

const MovieCard = styled(Card)({
  position: 'relative',
  width: '100%',
  border: '2px solid gray',
  margin: 8,
  '&:hover .details': {
    opacity: 1,
  },
});

const MoviePoster = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: '160%',
  // border:"1px solid red",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: theme.palette.primary.contrastText,
  "&:hover .media-info": { opacity: 1, bottom: 0 },
  "&:hover .media-back-drop, &:hover .media-play-btn": { opacity: 1 },
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

const SharePlaylistDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      setLoading(true);
      const { response, err } = await mediaApi.getPlaylistDetail(id);
      setLoading(false);

      if (err) {
        toast.error(err.message);
      } else {
        setPlaylist(response);
      }
    };

    fetchPlaylistDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!playlist) {
    return (
      <Box p={3}>
        <Typography variant="h6">Playlist not found</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" color="primary" mt={8}>
          {playlist.name} ({playlist.movies.length} movies)
        </Typography>
        <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
          {playlist.isPublic ? <><PublicIcon fontSize="small" sx={{ mr: 1 }} />Public</> : <><LockIcon fontSize="small" sx={{ mr: 1 }} />Private</>}
        </Typography>
      <Grid container spacing={2}>
        {playlist.movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie._id}>
            <MovieCard>
              <Link to={`/movie/${movie.mediaId}`}>
                <MoviePoster sx={{ backgroundImage: `url(${tmdbConfigs.posterPath(movie.mediaPoster)})` }}>
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
                  <MovieDetails className="details">
                    <Typography variant="h6">{movie.mediaTitle}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {movie.releaseDate}
                    </Typography>
                    <CircularRate value={movie.mediaRate} />
                  </MovieDetails>
                </MoviePoster>
              </Link>
            </MovieCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SharePlaylistDetail;
