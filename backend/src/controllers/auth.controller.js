import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Notification from "../models/notification.model.js";
import environmentData from "../models/environmentData.model.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wring while generating refresh and access token"
    );
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { email, fullName, password, cPassword } = req.body;
  const trimmedEmail = email?.trim();
  const trimmedfullName = fullName?.trim();

  const hasEmptyField = [
    trimmedEmail,
    trimmedfullName,
    password,
    cPassword,
  ].some((field) => field === "");

  if (hasEmptyField) {
    throw new ApiError(400, "All fields are required and cannot be empty.");
  }
  const existingUser = await User.findOne({ email: trimmedEmail });

  //if email already exists throw error
  if (existingUser) {
    throw new ApiError(409, "User with email already exists");
  }

  if (password !== cPassword) {
    throw new ApiError(400, "Password mismatch");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email: trimmedEmail,
    fullName: trimmedfullName,
    password:hashedPassword,
  });

  await user.save();

  return res
    .status(201)
    .json(new ApiResponse(201, { user }, "Registration Success!"));
});

export const loginUser = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  const trimmedEmail = email?.trim();
  if (!password && !trimmedEmail) {
    throw new ApiError(400, "Fields cannot be empty");
  }

  const user = await User.findOne({ email: trimmedEmail });
  // console.log(user)
  if (!user) {
    return res.status(400).send({ error: "User does not exist." });
  }
// console.log(password, user.password);
  // const isPasswordValid = await bcrypt.compare(password, user.password);
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.status(401).send({ error: "Invalid user credentials." });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Expired refresh token");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");

  if (!user) {  
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, { user }, "User found"));
});

export const getAllNotification = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the request (assuming the user is authenticated)
    
    // Fetch all notifications for the user from the database
    const notifications = await Notification.find({ receiverID: userId })
      .sort({ createdAt: -1 }) // Optionally sort by creation date (most recent first)
      .exec();
    // If no notifications are found
    if (!notifications) {
      return res.status(404).json({ message: "No notifications found." });
    }

    // Return the notifications as a response
    res.status(200).json({ notifications });
  } catch (error) {
    // Handle any errors that may occur during the process
    res.status(500).json({ message: "Failed to fetch notifications.", error: error.message });
  }
});


export const getAllEnvironmentData = asyncHandler(async (req, res) => {
  try {
    console.log("Fetching all environment data...");

    // Fetch all environment data from the database, sorted by 'createdAt' in descending order
    const environmentDatas = await environmentData.find()
      .sort({ createdAt: -1 }) // Sorting by 'createdAt' (most recent first)
      .exec();

    console.log("Fetched environment data:", environmentDatas);


    // Return the environment data as a response
    res.status(200).json({ environmentDatas });

  } catch (error) {
    console.error("Error fetching environment data:", error.message);

    // Handle any errors that may occur during the process
    res.status(500).json({ message: "Failed to fetch environment data.", error: error.message });
  }
});
