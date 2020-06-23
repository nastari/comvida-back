module.exports = (sequelize, DataTypes) => {
  const Files = sequelize.define(
    'Files',
    {
      originalName: DataTypes.STRING,
      fileName: DataTypes.STRING,
      url: {
        type: DataTypes.VIRTUAL,
        get() {
          return `http://localhost:6666/files/${this.fileName}`;
        },
      },
    },
    {}
  );

  return Files;
};
