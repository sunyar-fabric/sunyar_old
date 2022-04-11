
module.exports = (sequelize, DataTypes) => {
    const tblNeedyAccounts = sequelize.define('tblNeedyAccounts', {
        needyAccountId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
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
        },
        accountName: {
            type: DataTypes.STRING(500)
        },
        shebaNumber: {
            type: DataTypes.STRING(26),
            allowNull: false,
        },
        bankId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        needyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        schema : "BM",
        uniqueKeys: {
            uniqueItems1: { fields: ['needyId', 'accountNumber'] },
            uniqueItems2: { fields: ['shebaNumber'] }
        }
    });
    return tblNeedyAccounts;
};

