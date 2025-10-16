import "dotenv/config";

export const ENV = {
    PORT: process.env.PORT || 3000,
    APP_ENV: process.env.APP_ENV,
    CLIENT_URL: process.env.CLIENT_URL,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
};
