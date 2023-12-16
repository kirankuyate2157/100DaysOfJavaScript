import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "./../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { cookieParser } from "cookie-parser";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //i validating it  no need to again validation so .
    return { accessToken, refreshToken };
  } catch (error) {}
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
  if (!email || !username) {
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
  find user bi id


  */
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
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

export { registration, loginUser, logoutUser };
