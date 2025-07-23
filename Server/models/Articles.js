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
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return Articles;
};