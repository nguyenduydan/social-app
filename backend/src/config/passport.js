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
                // Find existing user
                let user = await User.findOne({ googleId: profile.id });
                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        role: "user",
                        avatar: profile.photos[0].value,
                    });
                }
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

export default passport;
