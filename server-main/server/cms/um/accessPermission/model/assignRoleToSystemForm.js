
module.exports = (sequelize, DataTypes) => {
    const tblAssignRoleToSystemForm = sequelize.define('tblAssignRoleToSystemForm', {
        assignRoleToSystemFormId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        hasAccess: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        schema: 'CMS',
        uniqueKeys: {
            uniqueItems: { fields: ['roleId', 'systemFormId'] }
        }
    });
    return tblAssignRoleToSystemForm;
};