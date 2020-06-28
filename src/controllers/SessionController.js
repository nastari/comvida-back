import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import { Users, Files, forgotPassword } from '../models';
import emailResetPassword from '../lib/Mail/resetPassword';
import { auth } from '../config/auth';

const jwt = require('jsonwebtoken');

export const store = async (req, res) => {
  const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().min(6).required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(401).json('Validation fails');
  }

  const { email, password } = req.body;

  const user = await Users.findOne({
    where: { email },
    include: [
      {
        model: Files,
        as: 'avatar',
        attributes: ['key', 'originalName', 'url'],
      },
    ],
  });

  if (!user) {
    return res.status(401).json({ message: 'User not found.' });
  }

  bcrypt.compare(password, user.hash, (error, compare) => {
    if (!compare) {
      return res.status(400).json({ message: 'Password does not match' });
    }
    const { id } = user;
    return res.status(200).json({
      user,
      token: jwt.sign({ id }, auth.secret, {
        expiresIn: auth.expiresIn,
      }),
    });
  });
};

export const forgot = async (req, res) => {
  const schema = Yup.object().shape({
    email: Yup.string().email().required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(401).json('Validation fails');
  }

  const { email } = req.body;

  const user = await Users.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'User not found.' });
  }
  const id = uuidv4();

  const request = {
    id,
    email,
  };

  const lastQuery = await forgotPassword.findOne({
    where: { email },
    limit: 1,
    order: [['createdAt', 'DESC']],
  });

  const now = new Date().getTime();

  if (lastQuery && now < lastQuery.createdAt.getTime() + 180000) {
    return res
      .status(401)
      .json({ message: 'Wait 3 minutes to resend password recovery email' });
  }

  const queryPasswordForgot = await forgotPassword.create(request);

  emailResetPassword(email, user.name, id);

  return res.json(queryPasswordForgot);
};

export const reset = async (req, res) => {
  const { password } = req.body;
  const passwordSchema = Yup.string().min(6).required();

  if (!(await passwordSchema.isValid(password))) {
    return res.status(401).json('Validation fails');
  }

  const { id } = req.params;
  if (!id) {
    return res.status(401).json('Acess denied.');
  }
  const acess = await forgotPassword.findByPk(id);
  const user = await Users.findOne({
    where: { email: acess.dataValues.email },
  });
  if (!user) {
    return res.status(401).json({ message: 'Something wrong happens' });
  }

  await user.update({ password });

  await forgotPassword.destroy({ where: { id } });

  return res.status(200).json({ message: 'Password change.' });
};
