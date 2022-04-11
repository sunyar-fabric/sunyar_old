
module.exports = (sequelize, DataTypes) => {
    const tblRole = sequelize.define('tblRole', {
        roleId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        faName: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        enName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true
        }
    },{
        schema: 'CMS'
    });
    return tblRole;
};