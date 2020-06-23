import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import { Users, forgotPassword } from '../models';
import emailResetPassword from '../lib/Mail/resetPassword';

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

  const user = await Users.findOne({ where: { email } });

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
      token: jwt.sign({ id }, '0d7fd6618bd44c8b57cd492556280201', {
        expiresIn: '7d',
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
  console.log(user);
  if (!user) {
    return res.status(401).json({ message: 'User not found.' });
  }
  const id = uuidv4();
  const request = {
    id,
    email,
  };

  const queryPasswordForgot = await forgotPassword.create(request);

  emailResetPassword(email, user.name, id);

  return res.json(queryPasswordForgot);
};

export const reset = async (req, res) => {
  const schema = Yup.object().shape({
    password: Yup.string().min(6).required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(401).json('Validation fails');
  }
  const { id } = req.params;
  const { password } = req.body;
  if (!id) {
    return res.status(401).json('Acess denied.');
  }
  const acess = await forgotPassword.findByPk(id);

  const user = await Users.findOne({ where: { email: acess.email } });

  if (!user) {
    return res.status(401).json({ message: 'Something wrong happens' });
  }

  await user.update({ password });

  return res.json({ message: 'Password change.' });
};
