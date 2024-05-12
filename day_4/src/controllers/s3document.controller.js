import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Function to generate a signed URL for uploading a file to S3
const generateUrl = asyncHandler(async (req, res) => {
  const { fileName, contentType } = req.query;

  // Create S3 client with credentials
  const s3Client = new S3Client({
    region: process.env.region,
    credentials: {
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    },
  });

  if (!fileName || !contentType) {
    throw new ApiError(400, "File name or content type missing");
  }

  // Prepare PUT command to upload file
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: `${fileName}`,
    ContentType: contentType,
  });

  // Generate signed URL for the upload
  const url = await getSignedUrl(s3Client, command, { expiresIn: 180 });

  // Return the signed URL to the client using ApiResponse format
  res.status(200).json(new ApiResponse(200, { url }, "Signed URL generated successfully"));
});

// Function to generate a signed URL for downloading a file from S3
const getDownloadUrl = asyncHandler(async (req, res) => {
  const { fileName } = req.query;

  // Create S3 client with credentials
  const s3Client = new S3Client({
    region: process.env.region,
    credentials: {
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    },
  });

  if (!fileName) {
    throw new ApiError(400, "File name missing");
  }

  // Prepare GET command to retrieve object from S3
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
  });

  // Generate signed URL for the download
  const url = await getSignedUrl(s3Client, command);

  // Return the signed URL to the client using ApiResponse format
  res.status(200).json(new ApiResponse(200, { url }, "Download URL generated successfully"));
});

// Function to delete a file from S3
const deleteFile = asyncHandler(async (req, res) => {
  const { fileName } = req.query;

  // Create S3 client with credentials
  const s3Client = new S3Client({
    region: process.env.region,
    credentials: {
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    },
  });

  if (!fileName) {
    throw new ApiError(400, "File name missing");
  }

  // Prepare DELETE command to delete object from S3
  const command = new DeleteObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
  });

  // Send the delete command to S3
  await s3Client.send(command);

  // Return success response using ApiResponse format
  res.status(200).json(new ApiResponse(200, {}, `File ${fileName} deleted successfully`));
});

export { generateUrl, getDownloadUrl, deleteFile};
