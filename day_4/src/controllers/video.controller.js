import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  try {
    let videoQuery = { owner: userId };

    // If a query string is provided, add it to the videoQuery
    if (query) {
      // Example: if query is a string property, you can search for it in title and description fields
      videoQuery.$or = [{ title: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }];
    }
    const videos = await Video.find(videoQuery)
      .limit(Number(limit))
      .skip((page - 1) * Number(limit))
      .sort({ [sortBy]: sortType === "desc" ? -1 : 1 })
      .exec();

    if (videos.length === 0) {
      throw new ApiError("404", "Videos Not found 🫠 ");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, videos, "videos fetched successfully ✅"));
  } catch (error) {
    throw new ApiError("500", "Error while fetching videos 🫠 ");
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  const videoLocalPath = req.files?.videoFile[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let thumbnailLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  }
  if (!videoLocalPath) {
    throw new ApiError(400, "video file is required 🫠");
  }
  const video = await uploadOnCloudinary(videoLocalPath);
  if (thumbnailLocalPath)
    var thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  console.log(" video uploaded :", video);

  const createdVideo = await User.create({
    videoFile: video.url,
    thumbnail: thumbnail.url,
    title: title,
    description: description,
    duration: video.duration,
    owner: req.user._id,
  });

  if (!createdVideo) {
    throw new ApiError(500, "Something went wrong 🫠 while publishing video ");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(200, createdVideo, "Video published Successfully ✅")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError("404", "Video Not Found 🫠 ");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched Successfully ✅"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  const { title, description } = req.body;
  let thumbnailLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  }
  if (thumbnailLocalPath)
    var thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  const updateData = {};
  if (title) {
    updateData.title = title;
  }
  if (description) {
    updateData.description = description;
  }
  if (thumbnail) {
    updateData.thumbnail = thumbnail;
  }
  if (videoId) {
    throw new ApiError("400", "Error VideoId not specified 🫠 ");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: updateData,
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated successfully ✅"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  const video = await Video.findByIdAndDelete(videoId);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { videoId: videoId },
        "Video Deleted successfully ✅"
      )
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
