import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

const playlistSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  movies: [
    {
      mediaType: {
        type: String,
        enum: ["tv", "movie"],
        required: true
      },
      mediaId: {
        type: String,
        required: true
      },
      mediaTitle: {
        type: String,
        required: true
      },
      mediaPoster: {
        type: String,
        required: true
      },
      mediaRate: {
        type: Number,
        required: true
      }
    }
  ]
}, modelOptions);

const playlistModel = mongoose.model("Playlist", playlistSchema);

export default playlistModel;
