import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "./../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //i validating it  no need to again validation so .
    return { accessToken, refreshToken };
  } catch (error) { }
};

const registration = asyncHandler(async (req, res) => {
  /*
    - get user details from frontend
    - validations - check it not empty
    - check if user already exists: user ,email
    - check for images ,check for avatar
    - uploads them to cloudinary , avatar
    - create user object - create entry in DB
    - remove password and refresh token field from responses
    - check for user creation
    - return res
    */

  const { username, email, password, fullName } = req.body;
  // console.log({
  //   email: email,
  //   username: username,
  //   password: password,
  //   fullName: fullName,
  // });

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "field is missing or empty 🫠");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with mail or  username already exists 🫠");
  }

  console.log("Uploading imges : ", req.files.avatar[0].path);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files?.coverImage[0]?.path;
  }
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required 🫠");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (coverImageLocalPath)
    var coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // console.log("uploded images : ", {
  //   avatar: avatar,
  //   coverImage: coverImage,
  // });

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    avatar: avatar.url,
    email,
    coverImage: coverImage?.url || "",
    password,
  });

  const createdUser = await User.findById(user.id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong 🫠 while registering user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully ✅"));
});

const loginUser = asyncHandler(async (req, res) => {
  /* 
- req body data
- find username email in DB
- check password match
- if match make  refresh token send data with it 
- send cookies
*/

  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "username or email is required 🫠..");
  }
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError(404, "user does not exist .🫠..");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials 🫠..");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken "
  );

  const options = { httpOnly: true, secure: true }; //only modifiable  by server

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedUser, accessToken, refreshToken },
        "user logged in successfully ✅"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  /*
  use cookies to find user 
  find user by id
  clear cookies and refreshToken of user

  */
  User.findByIdAndUpdate(
    req.user._id,
    {
      // $set: { refreshToken: undefined },
      $unset: {
        refreshToken: 1 //this will removes refreshToken from document 
      }
    },
    { new: true }
  );

  const options = { httpOnly: true, secure: true }; //only modifiable  by server

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logout in successfully ✅"));
});

const refreshTokenToAccessToken = asyncHandler(async (req, res) => {
  const IncomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!IncomingRefreshToken) {
    throw new ApiError(401, "unauthorized request 🫠");
  }

  try {
    const decodedRefreshToken = jwt.verify(
      IncomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) throw new ApiError(401, "Invalid Refresh token User Not found ");

    if (IncomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used 🫠");
    }
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);
    const options = { httpOnly: true, secure: true }; //only modifiable  by server

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed and stored ✅"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token 🫠");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(401, "Invalid email or password 🫠");
  }

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, " Incorrect old password 🫠");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully ✅"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { email, fullName } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All field are required 🫠");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { fullName: fullName, email: email },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Account details updated successfully ✅")
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "user fetched successfully ✅"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError("400", "Avatar file is missing 🫠");
  }

  //delete old image is pending
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError("404", "Error while uploading on avatar 🫠 ");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avatar: avatar.url },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully ✅"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError("400", "cover Image file is missing 🫠");
  }

  //delete old image is pending
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError("404", "Error while uploading on coverImage 🫠 ");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { coverImage: coverImage.url },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "cover Image image updated successfully ✅")
    );
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
    throw new ApiError(400, "username is missing 🫠");
  }

  //aggregation pipelines for find relation and getting exact data pipelines in such word getting method return data
  const channel = await User.aggregate([
    {
      $match: { username: username?.toLowerCase() },
    },
    {
      // looking for data currently in User so from subscription Model with referee of user id  it-self and user is a channel itself so  channel name in short finding doc with channel name  for counting subscribers i.e., number of channels in docs  that much subscribers
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    //looking for data currently in User so from subscription Model with user id it-self and subscriber is user  so counting that subscribed user to he to how many doc with it name is appearing for count InShort count of user in docs means that channels he has subscribed to..
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    //adding new filed for sending data to subscribers count in simple numbers added filed in response count and size if method  which find count of docs in channels filtered as per that subscribers and subscribeTo and for current channel is subscriber or not  for that Boolean
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    // adding in one object all necessary filed and values for only send required data ..
    {
      $project: {
        fullName: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
      },
    },
  ]);

  console.log(" channel data : ", channel);

  if (!channel?.length) {
    throw new ApiError(404, "channel does not exists 🫠");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully ✅")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      //find user whom requesting by matching user id
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      //in that user find watch history of videos data so get videos by id. of videos from watch history
      $lookup: {
        form: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          //pipeline for getting owner data by lookup way and get the name,username, avatar
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
        user[0].watchHistory,
        "watch history fetched successfully ✅"
      )
    );
});

const loginGoogleDB = asyncHandler(async (req, res) => {
  const { _id, email } = req.user.user;

  if (!_id) {
    throw new ApiError(404, "user does not exist .🫠..");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(_id);

  const loggedUser = await User.findById(_id).select(
    "-password -refreshToken "
  );

  const options = { httpOnly: true, secure: true }; //only modifiable  by server

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedUser, accessToken, refreshToken },
        "user logged in successfully ✅"
      )
    );
});

const googleAuthFail = asyncHandler(async (req, res) => {
  throw new ApiError(404, "user does not exist .🫠..");
});
export {
  registration,
  loginUser,
  logoutUser,
  refreshTokenToAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  getCurrentUser,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  loginGoogleDB,
  googleAuthFail,
};
