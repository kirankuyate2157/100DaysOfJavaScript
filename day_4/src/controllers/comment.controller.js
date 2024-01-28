import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 6 } = req.query;

  const video = await findById(videoId);
  if (!video) {
    throw new ApiError(404, "video not found");
  }
  const comments = await Comment.find({ videos: videoId })
    .limit(Number(limit))
    .skip((page - 1) * Number(limit))
    .sort({ [sortBy]: sortType === -1 ? -1 : 1 })
    .exec();

  if (comments.length === 0) {
    throw new ApiError("404", "Videos Not found 🫠 ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "comments fetched successfully ✅"));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;
  // TODO: add a comment to a video
  if (!content) {
    throw new ApiError("400", "content is required 🫠");
  }
  const comment = Comment.create({
    content: content,
    videos: new mongoose.Types.ObjectId(videoId),
    owner: new mongoose.Types.ObjectId(req.user._id),
  });

  if (!comment) {
    throw new ApiError("500", "something went wrong while creating comment 🫠");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        comment,
        `comment ${comment._id} created successfully ✅`
      )
    );
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { videoId, commentId } = req.params;
  const { content } = req.body;

  const comment = await Comment.findById(commentId);
  if(comment.owner!==req.user._id) {
    throw new ApiError("402", "user does not have access to modify comment 🫠");
  }
  if (!content) {
    throw new ApiError("400", "content is required 🫠");
  }

  const UpdatedComment = Comment.findByIdAndUpdate(
    commentId ,
    {
      $set:{content: content},
    },
    { newt: true }
  );

  if (!UpdatedComment) {
    throw new ApiError("500", "something went wrong while updating comment 🫠");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        UpdatedComment,
        `comment ${comment._id} Updated successfully ✅`
      )
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if(comment.owner!==req.user._id) {
    throw new ApiError("402", "user does not have access to delete comment 🫠");
  }
  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if(!deletedComment){
    throw new ApiError("500", "something went wrong with deletion of comment 🫠");
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, {}, `Comment ${comment.id} deleted successfully ✅`)
  );

});

export { getVideoComments, addComment, updateComment, deleteComment };
