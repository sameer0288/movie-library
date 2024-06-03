// src/pages/PlaylistDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import mediaApi from '../api/modules/media.api';
import { toast } from 'react-toastify';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

const SharePlaylistDetail = () => {
  const { id } = useParams();
  console.log(id);
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
    return <div>Loading...</div>;
  }

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        {playlist.name} ({playlist.movies.length} movies)
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {playlist.isPublic ? 'Public' : 'Private'}
      </Typography>
      <Grid container spacing={2}>
        {playlist.movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{movie.mediaTitle}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {movie.releaseDate}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SharePlaylistDetail;
