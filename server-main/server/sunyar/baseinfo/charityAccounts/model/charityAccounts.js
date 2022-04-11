
module.exports = (sequelize, DataTypes) => {
    const tblCharityAccounts = sequelize.define('tblCharityAccounts', {
        charityAccountId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        branchName: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        ownerName: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        cardNumber: {
            type: DataTypes.STRING(20),
        },
        accountNumber: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true
        },
        accountName: {
            type: DataTypes.STRING(500)
        },
        bankId: {
            type: DataTypes.INTEGER,
            allowNull : false
        },
    },{
        schema: 'BI',
        uniqueKeys: {
            uniqueItems: { fields: ['accountNumber'] }
        }
    });
    return tblCharityAccounts;
};
