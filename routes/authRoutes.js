import express from 'express';
import passport from 'passport';
const router = express.Router();

const DEV_CLIENT_URL = 'http://localhost:5173';
const PROD_CLIENT_URL = 'https://sq-blog-client.vercel.app';
console.log(process.env.NODE_ENV);

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    // successRedirect:
    //   process.env.NODE_ENV === 'development' ? DEV_CLIENT_URL : PROD_CLIENT_URL,
    failureRedirect:
      process.env.NODE_ENV === 'development'
        ? `${DEV_CLIENT_URL}/fail`
        : `${PROD_CLIENT_URL}/fail`,
    session: true,
  }),
  (req, res) => {
    res.redirect(PROD_CLIENT_URL);
  }
);

router.get('/api/current_user', (req, res) => {
  return res.send(req.user);
});

router.get('/api/logout', (req, res) => {
  req.logout();
  return res.send(req.user);
});

export default router;
