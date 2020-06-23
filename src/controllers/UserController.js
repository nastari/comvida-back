import bcrypt from 'bcryptjs';
import * as Yup from 'yup';
import { Users, Files } from '../models';

export const store = async (req, res) => {
  const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required().min(6),
    confirm: Yup.string()
      .required()
      .oneOf([Yup.ref('password')]),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(401).json('Validation fails');
  }

  const { email } = req.body;

  const user = await Users.findOne({ where: { email } });

  if (user) {
    return res.status(401).json({ message: 'User alreadt existis.' });
  }
  const { name, password } = req.body;

  const newUser = await Users.create({ name, email, password, online: false });

  return res.json(newUser);
  // return res.status(200).json({ name, email, id });
};

export const update = async (req, res) => {
  const { email, oldpass, password } = req.body;
  const user = await Users.findByPk(req.userId);

  if (password && password.length < 6) {
    return res.status(401).json({ message: 'Validation fails.' });
  }

  if (email && email !== user.email) {
    const userExists = await Users.findOne({ where: { email } });
    if (userExists) {
      return res.json({ sucess: false, message: 'User already exists.' });
    }
  }
  if (password && !oldpass) {
    return res
      .status(401)
      .json({ message: 'Need old pass to password reset.' });
  }

  if (oldpass && password) {
    await bcrypt.compare(oldpass, user.hash, (error, compare) => {
      if (!compare) {
        return res.status(400).json({ message: 'Password does not match' });
      }
    });
  }

  await user.update(req.body);
  const changedUser = await Users.findByPk(req.userId);
  return res.json(changedUser);
};

export const deleteUser = async (req, res) => {
  const id = req.userId;

  await Users.destroy({ where: { id } })
    .then(res.send('User deleted.'))
    .catch((error) => res.send(error));
};

export const index = async (req, res) => {
  const { page = 1, city, uf } = req.query;
  const limite = 6;
  const offset = (page - 1) * limite;

  if (city && uf) {
    const users = await Users.findAll({
      where: { online: true, city, uf },
      limit: limite,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Files,
          as: 'avatar',
          attributes: ['fileName', 'originalName', 'url'],
        },
      ],
    });
    return res.json(users);
  }

  if (uf) {
    const users = await Users.findAll({
      where: { online: true, uf },
      limit: limite,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Files,
          as: 'avatar',
          attributes: ['fileName', 'originalName', 'url'],
        },
      ],
    });

    return res.json(users);
  }

  if (city) {
    const users = await Users.findAll({
      where: { online: true, city },
      limit: limite,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Files,
          as: 'avatar',
          attributes: ['fileName', 'originalName', 'url'],
        },
      ],
    });

    return res.json(users);
  }

  const users = await Users.findAll({
    where: { online: true },
    limit: limite,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Files,
        as: 'avatar',
        attributes: ['fileName', 'originalName', 'url'],
      },
    ],
  });

  return res.json(users);
};

export const getOne = async (req, res) => {
  const { id } = req.params;

  await Users.findOne({
    where: { id },
    include: [
      {
        model: Files,
        as: 'avatar',
        attributes: ['fileName', 'originalName', 'url'],
      },
    ],
  }).then((user) => {
    if (user.length === 0) {
      return res.status(400).send('User not found.');
    }
    return res.status(200).json(user);
  });
};
