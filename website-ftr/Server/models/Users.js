module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true, // Not required for Google OAuth users
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Email should be unique
        },
        googleId: {
            type: DataTypes.STRING,
            allowNull: true, // Only for users who sign in with Google
            unique: true, // Each Google ID must be unique
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user',
        },
    });

    return Users;
};