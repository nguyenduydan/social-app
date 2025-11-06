import crypto from "crypto";
import bcrypt from "bcryptjs";
const BCRYPT_ROUNDS = 10;

export const generateResetCode = () => {
    return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
};

// Helper function to hash password
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    return await bcrypt.hash(password, salt);
};

// Helper function to compare passwords
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
