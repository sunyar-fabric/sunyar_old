module.exports = (sequelize, DataTypes) => {
    const tblCashAssistanceDetail = sequelize.define('tblCashAssistanceDetail', {
        cashAssistanceDetailId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        neededPrice: {
            type: DataTypes.DECIMAL(19,3),
            allowNull: false,
        },
        minPrice: {
            type: DataTypes.DECIMAL(19,3),
        },
        description: {
            type: DataTypes.TEXT
        },
        planId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        schema : "PM",
        uniqueKeys: {
            uniqueItems: { fields: ['assignNeedyPlanId', 'planId'] }
        }
    });
    return tblCashAssistanceDetail;
};



