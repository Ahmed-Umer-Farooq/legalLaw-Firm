const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../db');
const { generateToken } = require('../utils/token');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await db('users').where({ email: profile.emails[0].value }).first();

        if (!user) {
          const [id] = await db('users').insert({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user', // Default to user, can be changed later
            email_verified: true,
          });
          user = await db('users').where({ id }).first();
        }

        const token = generateToken(user);
        done(null, { user, token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/api/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await db('users').where({ email: profile.emails[0].value }).first();

        if (!user) {
          const [id] = await db('users').insert({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user', // Default to user
            email_verified: true,
          });
          user = await db('users').where({ id }).first();
        }

        const token = generateToken(user);
        done(null, { user, token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
