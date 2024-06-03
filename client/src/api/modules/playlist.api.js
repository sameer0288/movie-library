import privateClient from "../client/private.client";

const playlistEndpoints = {
  create: "/playlists/create",
  addMovieToPlaylist: "/playlists/add",
  getUserPlaylists: (userId) => `/playlists/users/${userId}/playlists`,
};

const playlistApi = {
  createPlaylist: async ({ userId, name, isPublic }) => {
    try {
      const response = await privateClient.post(playlistEndpoints.create, {
        userId,
        name,
        isPublic,
      });
      console.log(response);
      return { response }; // Return response within an object
  
    } catch (err) {
      return { error: err.response ? err.response.data : err.message }; // Return error object
    }
  },

  addMovieToPlaylist: async ({ userId, listId,  mediaId, mediaType, mediaTitle, mediaPoster, mediaRate }) => {
    console.log(userId,mediaType, mediaId,mediaTitle,mediaPoster,mediaRate,listId);
    try {
      const response = await privateClient.post(playlistEndpoints.addMovieToPlaylist, {
        userId,
        listId,
        mediaId: String( mediaId), // Ensure movieId is always passed as a string
        mediaType,
        mediaTitle,
        mediaPoster,
        mediaRate,
      });
      console.log("dsfdsfdfdfdfdf",response);
      return {response}; // Return response directly
    } catch (err) {
      return { error: err.response ? err.response : err.message }; // Return error object
    }
  },

  getUserPlaylists: async (userId) => {
    try {
      const response = await privateClient.get(playlistEndpoints.getUserPlaylists(userId));
      // console.log("getUserPlaylists response:", response);
      return { response }; // Return response directly
    } catch (err) {
      return { error: err.response ? err.response.data : err.message }; // Return error object
    }
  },
};

export default playlistApi;
