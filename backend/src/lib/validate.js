import bcrypt from "bcryptjs";

export const validateSignup = ({ displayName, email, password }) => {
    if (!displayName || !email || !password) {
        const err = new Error("All fields are required");
        err.status = 400;
        throw err;
    }

    if (password.length < 6) {
        const err = new Error("Password must be at least 6 characters");
        err.status = 400;
        throw err;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        const err = new Error("Invalid email format");
        err.status = 400;
        throw err;
    }
};


