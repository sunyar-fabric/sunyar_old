
module.exports = (sequelize, DataTypes) => {
    const tblPlan = sequelize.define('tblPlan', {
        planId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        planName: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        planNature: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        icon: {
            type: DataTypes.BLOB,
            allowNull: true,
        },
        fDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        tDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        neededLogin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        planHashCode:{
            type: DataTypes.STRING(1000),
            allowNull: true,
            defaultValue: null
        },
        isFinal: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        schema: "PM",
        uniqueKeys: {
            uniqueItems: { fields: ['planName', 'planNature', 'parentPlanId'] }
        }
    });
    return tblPlan;
};