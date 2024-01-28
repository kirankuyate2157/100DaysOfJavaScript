import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  if (!channelId) {
    throw new ApiError(400, "channelId is required 🫠");
  }
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, " channel not exist 🫠");
  }
  const isSubscribed = await Subscription.findOne({
    channel: channelId,
    subscriber: req?.user?._id,
  });
  if (isSubscribed) {
    const unsubscribed = await Subscription.findOneAndDelete({
      channel: channelId,
      subscriber: req?.user?._id,
    });
    if (!unsubscribed) {
      throw new ApiError(500, "something went wrong while unsubscribing 🫠");
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          {},
          `channel ${channelId} unSubscribed successfully ✅`
        )
      );
  } else {
    const subscribe = Subscription.create({
      channel: channelId,
      subscriber: req?.user?._id,
    });
    if (!subscribe) {
      throw new ApiError(500, "something went wrong while subscribing 🫠");
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          subscribe,
          `channel ${channelId} subscribed successfully`
        )
      );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "channelId is required 🫠");
  }
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, " channel not exist  🫠");
  }

  const subscriberList = await Subscription.find({ channel: channelId });
  if (!subscriberList) {
    throw new ApiError(
      500,
      "something went wrong with the subscription list fetching 🫠"
    );
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        subscriberList,
        "subscribers list fetched successfully ✅"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!subscriberId) {
    throw new ApiError(400, "subscriberId  is required 🫠");
  }
  const subscriber = await User.findById(subscriberId);
  if (!subscriber) {
    throw new ApiError(404, "subscriber not exist 🫠");
  }
  const subScribedChannels = Subscription.find({ subscriber: subscriberId });
  if (!subscribedChannels) {
    throw new ApiError(
      500,
      "something went wrong while fetching subscribed channels 🫠"
    );
  }

  return res.status.json(
    new ApiResponse(
      201,
      subScribedChannels,
      "subscribed channels fetched successfully ✅"
    )
  );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
