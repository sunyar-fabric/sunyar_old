module.exports = (
    sequelize, DataTypes) => {
    const tblPayment = sequelize.define('tblPayment', {
        paymentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        paymentPrice: {
            type: DataTypes.DECIMAL(19, 3),
            allowNull: false,
        },
        paymentGatewayId: {
            type: DataTypes.STRING(10),
        },
        paymentDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        paymentTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        paymentStatus: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        sourceAccoutNumber: {
            type: DataTypes.STRING(10),
        },
        targetAccountNumber: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        followCode: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        cashAssistanceDetailId : {
            type: DataTypes.INTEGER,
            allowNull: true,//it was false :)
        },
    },{
        schema : "OP",
    });
    return tblPayment;
};




