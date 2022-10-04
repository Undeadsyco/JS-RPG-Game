import express from 'express';
import hbs from 'nodemailer-express-handlebars';
import nodemailer from 'nodemailer';
import path from 'path';
import crypto from 'crypto';
import userModel from '../models/user';

const router = express.Router();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

const smtpTransport = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  auth: {
    user: email,
    pass: password,
  },
});

const handlebarsOptions = {
  viewEngine: {
    extName: '.hbs',
    defaultLayout: null,
    partialDir: './templates/',
    layoutsDir: './templates/',
  },
  viewPath: path.resolve('./templates/'),
  extName: '.html',
};

smtpTransport.use('compile', hbs(handlebarsOptions));

router.post('/forgot-password', async (req, res) => {
  const userEmail = req.body.email;
  const user = await userModel.findOne({ email: userEmail });
  if (!user) {
    res.status(400).json({ message: 'invalid email', status: 400 });
    return;
  }

  // create user token
  const buffer = crypto.randomBytes(20);
  const token = buffer.toString('hex');

  // update user reset password token & expo
  await userModel.findByIdAndUpdate(
    // eslint-disable-next-line no-underscore-dangle
    { _id: user._id },
    { resetToken: token, resetTokenExp: Date.now() + 600000 },
  );

  try {
    // send user password reset email
    const emailOptions = {
      to: userEmail,
      from: email,
      template: 'forgotPassword',
      subject: 'Zenva Phaser MMO Password Reset',
      context: {
        name: 'joe',
        url: `http://localhost:${process.env.PORT || 5000}/resetPassword.html?token=${token}`,
      },
    };
    await smtpTransport.sendMail(emailOptions);

    res.status(200).json({ message: 'An email has been sent to your email address. Password reset link is only valid for 10 mineuts', status: 200 });
  } catch (err) {
    console.log(err);
  }
});

router.post('/reset-password', async (req, res) => {
  const userEmail = req.body.email;

  const user = await userModel.findOne({
    resetToken: req.body.token,
    resetTokenExp: { $gt: Date.now() },
    email: userEmail,
  });

  if (!user) {
    res.status(400).json({ message: 'invalid token', status: 400 });
    return;
  }

  // ensure password was provided, and password matches
  if (
    !req.body.password
    || !req.body.verifiedPassword
    || req.body.password !== req.body.verifiedPassword
  ) {
    res.status(400).json({ message: 'passwords dont match', status: 400 });
    return;
  }

  // update user model
  user.password = req.body.password;
  user.resetToken = undefined;
  user.resetTokenExp = undefined;
  await user.save();

  try {
    // send user password update email
    const emailOptions = {
      to: userEmail,
      from: email,
      template: 'resetPassword',
      subject: 'Zenva Phaser MMO Password Reset Confirmation',
      context: {
        name: user.username,
      },
    };
    await smtpTransport.sendMail(emailOptions);

    res.status(200).json({ message: 'Password Updated', status: 200 });
  } catch (err) {
    console.log(err);
  }
});

export default router;
