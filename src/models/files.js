module.exports = (sequelize, DataTypes) => {
  const Files = sequelize.define(
    'Files',
    {
      originalName: DataTypes.STRING,
      key: DataTypes.STRING,
      url: DataTypes.STRING,
    },
    {}
  );

  return Files;
};
