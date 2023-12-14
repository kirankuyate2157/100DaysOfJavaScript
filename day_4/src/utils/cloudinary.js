import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from "fs";


cloudinary.config({
    cloud_name: process.env.ClOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload file to  cloudinary storage
        cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' })
        //file upload successfully
        console.log('file upload successful 🌨️..', response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); //remove the local file temporary file got failed
        return null;
    }
}




cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
    { public_id: "olympic_flag" },
    function (error, result) { console.log(result); });