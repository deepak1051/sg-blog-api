import express from 'express';
import passport from 'passport';
const router = express.Router();

const CLIENT_URL = 'http://localhost:5173/';

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: 'http://localhost:5173/fail',
  })
  // (req, res) => {
  //   res.redirect('http://127.0.0.1:5173/blogs');
  // }
);

router.get('/api/current_user', (req, res) => {
  return res.send(req.user);
});

router.get('/api/logout', (req, res) => {
  req.logout();
  return res.send(req.user);
});

export default router;
