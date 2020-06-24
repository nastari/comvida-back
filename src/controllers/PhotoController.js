import { Users, Files } from '../models';

const store = async (req, res) => {
  const user_id = req.userId;
  const { originalname: originalName, key, location: url = '' } = req.file;

  const user = await Users.findByPk(user_id);

  const file = await Files.create({
    originalName,
    key,
    url,
  });

  await user.update({ avatar_id: file.id });

  return res.json(file);
};

export default store;
