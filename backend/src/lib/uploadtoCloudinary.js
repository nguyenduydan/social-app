import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (file, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `DIFA/${folder}`,
                resource_type: 'auto'
            },
            (error, result) => {
                if (error) {
                    reject(new Error(`Cloudinary upload failed: ${error.message}`));
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(file.buffer);
    });
};

export default uploadToCloudinary;
