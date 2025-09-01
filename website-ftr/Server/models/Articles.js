module.exports = (sequelize, DataTypes) =>{
    const Articles= sequelize.define("Articles",{
        title:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        content:{
            type: DataTypes.JSON,
            allowNull: false,
        },
        author:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        displayimg:{
            type: DataTypes.BLOB('medium'),
            allowNull: false,
        },
        genre:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        summary:{
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
    return Articles;
};