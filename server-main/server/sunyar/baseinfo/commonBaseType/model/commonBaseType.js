module.exports = (sequelize, DataTypes) => {

    const tblCommonBaseType = sequelize.define('tblCommonBaseType', {
        commonBaseTypeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        baseTypeCode: {
            type: DataTypes.STRING(3),
            unique: true

        },
        baseTypeTitle: {
            type: DataTypes.STRING(800),
            allowNull: false,
            unique: true
        }
    }, {
        schema: 'BI',
    });
    return tblCommonBaseType;
};