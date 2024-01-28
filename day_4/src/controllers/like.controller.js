import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  const isVideoLiked = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  if (isVideoLiked) {
    var unlike = await Like.findOneAndDelete({
      video: videoId,
      likedBy: req.user._id,
    });
    if (!unlike) {
      throw new ApiError(500, "something went wrong while video unlike 🫠");
    }
  } else {
    var like = await Like.create({ video: videoId, likedBy: req.user._id });
    if (!like) {
      throw new ApiError(500, "something went wrong while video like 🫠");
    }
  }
  //return response
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {},
        `video ${like ? "liked " : "unLiked"} successfully ✅`
      )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  const isCommentLiked = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (isCommentLiked) {
    var unlike = await Like.findOneAndDelete({
      comment: commentId,
      likedBy: req.user._id,
    });
    if (!unlike) {
      throw new ApiError(500, "something went wrong while comment unlike 🫠");
    }
  } else {
    var like = await Like.create({ comment: commentId, likedBy: req.user._id });
    if (!like) {
      throw new ApiError(500, "something went wrong while comment like 🫠");
    }
  }
  //return response
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {},
        `comment ${commentId} ${like ? "liked " : "unLiked"} successfully ✅`
      )
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  const isTweetLiked = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  if (isTweetLiked) {
    var unlike = await Like.findOneAndDelete({
      tweet: tweetId,
      likedBy: req.user._id,
    });
    if (!unlike) {
      throw new ApiError(500, "something went wrong while tweet unlike 🫠");
    }
  } else {
    var like = await Like.create({ tweet: tweetId, likedBy: req.user._id });
    if (!like) {
      throw new ApiError(500, "something went wrong while tweet like 🫠");
    }
  }
  //return response
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {},
        `tweet ${tweetId} ${like ? "liked " : "unLiked"} successfully ✅`
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const videos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      //in that user find watch history of videos data so get videos by id. of videos from watch history
      $lookup: {
        form: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  //selecting only necessary fields from users
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            //it making simple direct access array data object  from owner array got from above lookup it  videos data + owner field data object
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        videos[0].video,
        "watch history fetched successfully ✅"
      )
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
