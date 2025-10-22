import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ENV } from "../config/env.js";
import User from "../models/User.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: ENV.GOOGLE_CLIENT_ID,
            clientSecret: ENV.GOOGLE_CLIENT_SECRET,
            callbackURL: ENV.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                const photoUrl = profile.photos?.[0]?.value;

                let user = await User.findOne({ googleId: profile.id });

                // Nếu chưa có, kiểm tra theo email
                if (!user && email) {
                    user = await User.findOne({ email });
                    if (user) {
                        user.googleId = profile.id;
                        // Cập nhật avatar nếu chưa có
                        if (!user.avatar?.url && photoUrl) {
                            user.avatar = { url: photoUrl };
                        }
                        await user.save();
                    }
                }

                // Nếu vẫn chưa có, tạo mới
                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email,
                        role: "user",
                        avatar: {
                            url: photoUrl,
                            publicId: null,
                        },
                    });
                } else {
                    // Nếu user đã tồn tại nhưng avatar khác -> cập nhật
                    if (photoUrl && user.avatar?.url !== photoUrl) {
                        user.avatar = { url: photoUrl };
                        await user.save();
                    }
                }

                return done(null, user);
            } catch (error) {
                console.error("Google OAuth error:", error);
                return done(error, null);
            }
        }
    )
);

export default passport;
