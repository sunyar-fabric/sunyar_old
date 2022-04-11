
module.exports = (sequelize, DataTypes) => {
    const tblAssignNeedyToPlan = sequelize.define('tblAssignNeedyToPlan', {
        assignNeedyPlanId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        fDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        tDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        needyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        planId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    }, {
        schema : "PM",
        uniqueKeys: {
            uniqueItems: { fields: ['needyId', 'planId'] }
        }
    });
    return tblAssignNeedyToPlan;
};


