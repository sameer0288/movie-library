import privateClient from "../client/private.client";

const playlistEndpoints = {
  create: "/lists/create",
  addMovieToPlaylist: "/lists/add",
};

const playlistApi = {
  createPlaylist: async ({ userId, name, isPublic }) => {
    try {
      const response = await privateClient.post(playlistEndpoints.create, {
        userId,
        name,
        isPublic,
      });
      return { response };
    } catch (err) {
      return { err };
    }
  },
  addMovieToPlaylist: async ({ userId, listId, movieId }) => {
    const convertedMovieId = String(movieId); // Convert movieId to string
    try {
      const response = await privateClient.post(playlistEndpoints.addMovieToPlaylist, {
        userId,
        listId,
        movieId:convertedMovieId,
      });
      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default playlistApi;
