
module.exports = (sequelize, DataTypes) => {
    const tblSystemForm = sequelize.define('tblSystemForm', {
        systemFormId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        faForm: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        enForm: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        systemKind: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        schema: 'CMS',
        uniqueKeys: {
            uniqueItems: { fields: ['enForm', 'sysParentId'] }
        }
    });
    return tblSystemForm;
};