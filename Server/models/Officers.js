module.exports = (sequelize, DataTypes) => {
    const Officers = sequelize.define("Officers", {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photo: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      youtube: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      linkedin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      instagram: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      x_social: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      facebook: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    });
  
    return Officers;
  };