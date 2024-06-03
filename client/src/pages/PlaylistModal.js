import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  List,
  ListItem,
  CircularProgress,
  Box,
  IconButton, // Import IconButton component from MUI
} from '@mui/material';
import { Lock, Public } from '@mui/icons-material'; // Import lock and public icons from MUI
import { toast } from 'react-toastify';
import playlistApi from '../api/modules/playlist.api';

const PlaylistModal = ({ open, onClose, user, media, mediaType }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [privacy, setPrivacy] = useState('private');
  const [creating, setCreating] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const { response, err } = await playlistApi.getUserPlaylists(user.id);
        setLoading(false);

        if (err) {
          setFetchError(err.message || "Failed to fetch playlists");
        } else {
          setPlaylists(response);
        }
      } catch (error) {
        setLoading(false);
        setFetchError("Failed to fetch playlists");
      }
    };

    if (user) {
      fetchPlaylists();
    }
  }, [open, user]);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName) {
      toast.error("Playlist name cannot be empty");
      return;
    }

    setCreating(true);
    try {
      const apiResponse = await playlistApi.createPlaylist({
        userId: user.id,
        name: newPlaylistName,
        isPublic: privacy === 'public',
      });
      setCreating(false);

      if (apiResponse.error) {
        toast.error(apiResponse.error || "Failed to create playlist");
      } else if (apiResponse.response) {
        setPlaylists([...playlists, apiResponse.response]);
        setNewPlaylistName('');
        toast.success('Playlist created successfully!');
        onClose();
      } else {
        toast.error("Failed to create playlist: Unknown error occurred");
      }
    } catch (error) {
      toast.error("Failed to create playlist: " + error.message);
      setCreating(false);
    }
  };

  const handlePlaylistSelect = (playlistId) => {
    setSelectedPlaylist(playlistId);
  };

  const handleAddToPlaylist = async () => {
    try {
      const response = await playlistApi.addMovieToPlaylist({
        userId: user.id,
        listId: selectedPlaylist,
        mediaType: mediaType,
        mediaId: media.id,
        mediaTitle: media.title || media.name,
        mediaPoster: media.poster_path,
        mediaRate: media.vote_average,
      });

      if (response.error) {
        toast.error(response.error || "Failed to add to playlist");
      } else {
        toast.success('Added to playlist successfully!');
        onClose();
      }
    } catch (error) {
      toast.error("Failed to add to playlist: " + error.message);
    }
  };

  const handleCloseModal = () => {
    setNewPlaylistName('');
    setSelectedPlaylist('');
    setCreating(false);
    setFetchError(null);
    onClose();
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleCloseModal}>
      <DialogTitle>Add to Playlist</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : fetchError ? (
          <Box>{fetchError}</Box>
        ) : (
          <>
            {playlists.length === 0 ? (
              <Box>No playlists found.</Box>
            ) : (
              <>
                <RadioGroup value={selectedPlaylist} onChange={(e) => handlePlaylistSelect(e.target.value)}>
                  <List>
                    {playlists.map((playlist) => (
                      <ListItem key={playlist.id}>
                        <FormControlLabel
                          value={playlist.id}
                          control={<Radio />}
                          label={playlist.name}
                        />
                        {playlist.isPublic ? (
                          <Public color="primary" /> // Show public icon if playlist is public
                        ) : (
                          <Lock color="primary" /> // Show lock icon if playlist is private
                        )}
                      </ListItem>
                    ))}
                  </List>
                </RadioGroup>
              </>
            )}
            <Box mt={2}>
              <TextField
                label="New Playlist Name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                fullWidth
                margin="dense"
              />
              <RadioGroup
                row
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
              >
                <FormControlLabel value="public" control={<Radio />} label="Public" />
                <FormControlLabel value="private" control={<Radio />} label="Private" />
              </RadioGroup>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="primary">Cancel</Button>
        <Button
          onClick={handleCreatePlaylist}
          color="primary"
          variant="contained"
          disabled={!newPlaylistName || creating}
        >
          {creating ? <CircularProgress size={24} /> : 'Create Playlist'}
        </Button>
        <Button
          onClick={handleAddToPlaylist}
          color="primary"
          variant="contained"
          disabled={!selectedPlaylist}
        >
          Add to Playlist
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlaylistModal;
