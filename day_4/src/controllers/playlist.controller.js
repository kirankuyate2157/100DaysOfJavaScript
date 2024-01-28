import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist

  if (
    !name ||
    name?.trim() === "" ||
    !description ||
    description?.trim() === ""
  ) {
    throw new ApiError(400, "name and description both are required");
  }
  const playList = await Playlist.create({
    name: name,
    description: description,
    owner: req?.user?._id,
  });
  if (!playList) {
    throw new ApiError(500, "something went wrong while created playList 🫠");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, playList, "playlist created successfully ✅"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "user not exist 🫠");
  }

  const playlists = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videos",
      },
    },
    {
      $addFields: {
        playlist: {
          $first: "$videos",
        },
      },
    },
  ]);
  if (!playlists) {
    throw new ApiError(
      500,
      "something went wrong while fetching playlists information ✅"
    );
  }
  return res
    .status(201)
    .json(new ApiResponse(201, playlists, "playlist fetched successfully ✅"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "This playlist id is not valid 🫠");
  }

  // find user in database
  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "playlist not found 🫠");
  }

  if (!playlist) {
    throw new ApiError(500, "something went wrong while fetching playlist 🫠");
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, playlist, "playlist fetched  successfully ✅"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "This playlist id is not valid 🫠");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "This video id is not valid 🫠");
  }
  // find playlist in db
  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "no playlist found 🫠");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You don't have permission to add video in this playlist! 🫠"
    );
  }

  // find video in db
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "no video found 🫠");
  }

  // if video already exists in playlist
  if (playlist.video.includes(videoId)) {
    throw new ApiError(400, "video already exists in this playlist!! 🫠");
  }

  // push video to playlist
  const addedToPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $push: {
        video: videoId,
      },
    },
    {
      new: true,
    }
  );

  if (!addedToPlaylist) {
    throw new ApiError(
      500,
      "something went wrong while added video to playlist !!"
    );
  }

  // return response
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        addedToPlaylist,
        " added video in playlist successfully!!"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "This playlist id is not valid 🫠");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "This video id is not valid 🫠");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "no playlist found 🫠");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You don't have permission to remove video in this playlist! 🫠"
    );
  }

  // find video in db
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "no video found 🫠");
  }

  // if video exists or not in playlist
  if (!playlist.video.includes(videoId)) {
    throw new ApiError(400, "video not exists in this playlist 🫠");
  }

  // remove video in the playlist
  const removeVideoToPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        video: videoId,
      },
    },
    {
      new: true,
    }
  );

  if (!removeVideoToPlaylist) {
    throw new ApiError(
      500,
      "something went wrong while removed video to playlist 🫠"
    );
  }

  // return response
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        removeVideoToPlaylist,
        "removed video in playlist successfully ✅"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  const PlayList = await Playlist.findById(playlistId);
  if (!PlayList) {
    throw new ApiError(404, "play list not exist 🫠");
  }
  if (PlayList.owner !== req.user._id) {
    throw new ApiError(
      402,
      "user does not have permission to delete playlist 🫠"
    );
  }
  const deletePlaylist = await PlayList.findByIdAndDelete(playlistId);
  if (!deletePlaylist) {
    throw new ApiError(500, "something went wrong when deleting playlist 🫠 ");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(201, {}, `playlist ${playlistId} deleted successfully ✅`)
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { NewName, NewDescription } = req.body;
  //TODO: update playlist

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "This playlist id is not valid");
  }
  // if any one is provided
  if (
    !(
      !NewName ||
      NewName?.trim() === "" ||
      !NewDescription ||
      NewDescription?.trim() === ""
    )
  ) {
    throw new ApiError(400, "Either name or description is required");
  } else {
    const playlist = await Playlist.findById(playlistId);

    if (playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You don't have permission to update this playlist!"
      );
    }

    const updatePlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $set: {
          name: NewName,
          description: NewDescription,
        },
      },
      {
        new: true,
      }
    );

    if (!updatePlaylist) {
      throw new ApiError(500, "something went wrong while updating playlist!!");
    }

    // return response
    return res
      .status(201)
      .json(
        new ApiResponse(200, updatePlaylist, "playlist updated successfully!!")
      );
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
