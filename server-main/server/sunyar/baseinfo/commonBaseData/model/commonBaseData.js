module.exports = (sequelize, DataTypes) => {
    const tblCommonBaseData = sequelize.define('tblCommonBaseData', {
        commonBaseDataId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        baseCode: {
            type: DataTypes.STRING(6),
        },
        baseValue: {
            type: DataTypes.STRING(800),
            allowNull: false,
        },
        commonBaseTypeId : {
            type: DataTypes.INTEGER,
            allowNull : false
        }
    },
    {
        schema: 'BI',
        uniqueKeys: {
            uniqueItems: { fields: ['commonBaseTypeId','baseValue'] },
            Second_unique_pair: { fields: ['commonBaseTypeId', 'baseCode']  }
        }
    });
    return tblCommonBaseData;
};
