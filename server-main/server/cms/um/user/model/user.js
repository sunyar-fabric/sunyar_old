
module.exports = (sequelize, DataTypes) => {
    const tblUser = sequelize.define('tblUser', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            allowNull: false,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        expireDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        failedTriesCount: { 
            type: DataTypes.INTEGER, 
            defaultValue: 0
        },
        bannedTime:{
            type: DataTypes.DATE,
        }
    }, {
        schema: 'CMS'
    });
    return tblUser;
};