module.exports = (sequelize, DataTypes) => {
    const tblAssignRoleToUser = sequelize.define('tblAssignRoleToUser', {
        assignRoleToUserId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            
        }
    }, {
        schema: 'CMS',
        uniqueKeys: {
            uniqueItems: { fields: ['userId', 'roleId'] }
        }
    });
    return tblAssignRoleToUser;
};