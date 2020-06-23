import bcrypt from 'bcryptjs';

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.VIRTUAL,
      hash: DataTypes.STRING,
      description: DataTypes.STRING,
      whatsapp: DataTypes.STRING,
      city: DataTypes.STRING,
      uf: DataTypes.STRING,
      online: DataTypes.BOOLEAN,
    },
    {}
  );
  Users.associate = function (models) {
    return Users.belongsTo(models.Files, {
      foreignKey: 'avatar_id',
      as: 'avatar',
    });
  };

  Users.addHook('beforeSave', async (user) => {
    if (user.password) {
      user.hash = await bcrypt.hash(user.password, 10);
      user.password = undefined;
    }
    return this;
  });

  return Users;
};
