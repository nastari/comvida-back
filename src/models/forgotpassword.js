module.exports = (sequelize, DataTypes) => {
  const forgotPassword = sequelize.define(
    'forgotPassword',
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      email: DataTypes.STRING,
      createdAt: DataTypes.DATE,
    },
    {}
  );

  return forgotPassword;
};
