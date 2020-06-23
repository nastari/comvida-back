import { Users, Files } from '../models';

async function store(req, res) {
  const { city, uf } = req.body;

  if (uf && !city) {
    const users = await Users.findAll({
      where: { uf },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Files,
          as: 'avatar',
          attributes: ['fileName', 'originalName', 'url'],
        },
      ],
    });
    return res.status(200).json(users);
  }

  const users = await Users.findAll({
    where: { city },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Files,
        as: 'avatar',
        attributes: ['fileName', 'originalName', 'url'],
      },
    ],
  });

  return res.status(200).json(users);
}

export default store;
