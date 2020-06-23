import { Users, Files } from '../models';

const store = async (req, res) => {
  const user_id = req.userId;
  const { originalname: originalName, filename: fileName } = req.file;

  const user = await Users.findByPk(user_id);

  const file = await Files.create({ originalName, fileName });

  await user.update({ avatar_id: file.id });

  return res.json(file);
};

export default store;
