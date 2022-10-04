/* eslint-disable no-underscore-dangle */
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();
const tokenList = {};

function processLogoutRequest(req, res) {
  if (req.cookies) {
    const refreshToken = req.cookies.refreshJwt;
    if (refreshToken in tokenList) delete tokenList[refreshToken];
    res.clearCookie('jwt');
    res.clearCookie('refreshJwt');
  }
  if (req.method === 'POST') {
    res.status(200).json({ message: 'logged out', status: 200 });
  } else if (req.method === 'GET') {
    res.sendFile('logout.html', { root: './public' });
  }
}

router.get('/status', (req, res) => {
  res.status(200).json({ message: 'ok', status: 200 });
});

router.post('/signup', passport.authenticate('signup', { session: false }), async (req, res) => {
  res.status(200).json({ message: 'signup successful', status: 200 });
});

router.post('/login', async (req, res, next) => {
  // eslint-disable-next-line consistent-return
  passport.authenticate('login', async (err, user) => {
    try {
      if (err) return next(err);

      if (!user) return next(new Error('email and password are required'));

      req.login(user, { session: false }, () => {
        if (err) return next(err);

        // create jwt token
        const body = {
          _id: user._id,
          email: user.email,
          name: user.username,
        };

        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: 86400 });
        const refreshToken = jwt.sign(
          { user: body },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: 86400 },
        );

        // store tokens in cookie
        res.cookie('jwt', token);
        res.cookie('refreshJwt', refreshToken);

        // store tokens in memory
        tokenList[refreshToken] = {
          token,
          refreshToken,
          email: user.email,
          _id: user._id,
          name: user.name,
        };

        // send token to user
        return res.status(200).json({ token, refreshToken, status: 200 });
      });
    } catch (error) {
      console.log(error);
      return next(err);
    }
  })(req, res, next);
});

router.route('/logout')
  .get(processLogoutRequest)
  .post(processLogoutRequest);

router.post('/token', (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken in tokenList) {
    const body = {
      email: tokenList[refreshToken].email,
      _id: tokenList[refreshToken]._id,
      name: tokenList[refreshToken].name,
    };
    const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: 86400 });

    // update jwt token
    res.cookie('jwt', token);
    tokenList[refreshToken].token = token;
    res.status(200).json({ token, status: 200 });
  } else {
    res.status(401).json({ message: 'unauthorized', status: 401 });
  }
});

export default router;
