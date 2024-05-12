import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";

const uploadVideo = asyncHandler(async (req, res) => {
    console.log(" video uploading started ..");
    try {
        const videoLocalPath = req?.file?.path;
        if (!videoLocalPath) {
            throw new ApiError("400", "Video file is missing 🫠");
        }

        //delete old image is pending
        // const video = await uploadOnCloudinary(videoLocalPath);

        // if (!video.url) {
        //   throw new ApiError("404", "Error while uploading on video 🫠 ");
        // }
        // convert video in HLS format
        const lessonId = uuidv4();
        const outputPath = `./public/test/course/${lessonId}`;
        const hlsPath = `${outputPath}/index.m3u8`;
        console.log("hlsPath", hlsPath);

        // if the output directory doesn't exist, create it
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }

        // command to convert video to HLS format using ffmpeg

        const ffmpegCommand = `ffmpeg -i ${videoLocalPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;
        // run the ffmpeg command; usually done in a separate process (queued)
        exec(ffmpegCommand, (error, stdout, stderr) => {
            if (error) {
                console.log(" 5 : ffmpeg error ");
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            const videoUrl = `http://localhost:${process.env.PORT}/public/test/course/${lessonId}/index.m3u8`;
            return res
                .status(200)
                .json(new ApiResponse(200, {
                    videoUrl: videoUrl,
                    lessonId: lessonId,
                }, "Video  uploaded & Video converted to HLS format successfully ✅"));
        });

    } catch (error) {
        res.status(500).send({
            message: "Something went Wrong,check Error 🫠",
            error: error,
        });
    }
});
export { uploadVideo };
