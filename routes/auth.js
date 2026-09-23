const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
const router = express.Router();

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

router.get('/github', passport.authenticate('github', { 
    scope: [ 'user:email' ], 
    session: false 
}));

router.get('/github/callback', 
  passport.authenticate('github', { 
      failureRedirect: '/login', 
      session: false 
  }),
  (req, res) => {
    const token = jwt.sign(
      { 
        userId: req.user.id, 
        username: req.user.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect('/auth/success');
  }
);

router.get('/success', (req, res) => {
  res.json({ message: 'Login successful. JWT written to HttpOnly cookie.' });
});

module.exports = router;