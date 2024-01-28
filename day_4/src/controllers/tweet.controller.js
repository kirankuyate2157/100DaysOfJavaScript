import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "tweet content is required 🫠");
  }
  const mediaLocalPath = req.files?.mediaFile[0]?.path;
  if (mediaLocalPath) {
    var media = await uploadOnCloudinary(mediaLocalPath);
  }
  const createdTweet = await Video.create({
    image: media?.url || "",
    content: content,
    owner: req.user._id,
  });
  if (!createdTweet) {
    throw new ApiError(500, "Something went wrong 🫠 while creating tweet");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(200, createdTweet, "tweet is created Successfully ✅")
    );
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;
  const tweet = await tweet.findById(userId);
  if (!tweet) {
    throw new ApiError(
      500,
      "Something went wrong 🫠 while fetching tweets or no tweets "
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "tweets fetched successfully ✅"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { content, tweetId } = req.body;

  if (!content || !tweetId) {
    throw new ApiError(400, "content or id required for updating tweet 🫠");
  }

  const tweet = await Tweet.findTweetById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "tweet not found 🫠");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: { content: content },
    },
    {
      new: true,
    }
  );
  if (!updatedTweet) {
    throw new ApiError(500, "something went wrong while updating tweet 🫠");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, updatedTweet, " tweet updated successfully ✅"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  const tweet = await Tweet.findTweetById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "tweet not found 🫠");
  }

  const updatedTweet = await Tweet.findByIdAndDelete(tweetId);
  if (!updatedTweet) {
    throw new ApiError(500, "something went wrong while deleting tweet 🫠");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, {}, `tweet ${tweetId} is deleted successfully`));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
