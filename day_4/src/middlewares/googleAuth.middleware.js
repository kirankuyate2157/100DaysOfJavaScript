// middelwares/googleAuth.middleware.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();
import { User } from "./../models/user.model.js";

const generateRandomPassword = () => {
  const length = 10; // You can adjust the length of the password
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/v1/users/current-user",
    },
    async (accessToken, refreshToken, profile, done) => {
      if (!profile) {
        done(error, null);
        return;
      }
      const randomPassword = generateRandomPassword();
      const newUser = {
        username: profile?.emails[0]?.value.split("@")[0], // You may want to customize the username creation logic
        email: profile?.emails[0]?.value,
        fullName: profile?.displayName,
        avatar: profile?.photos[0]?.value,
        password: randomPassword,
      };

      try {
        // check if the user exist
        const user = await User.findOne({ email: newUser.email }).select(
          "-password -refreshToken"
        );
        if (user) {
          done(null, { user });
        } else {
          // create new user
          const user = await User.create(newUser);
          // return user
          done(null, { user });
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((userData, done) => done(null, { ...userData }));
passport.deserializeUser((id, done) => done(null, id));
