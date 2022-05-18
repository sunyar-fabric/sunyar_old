
module.exports = (sequelize, DataTypes) => {
    const tblPersonal = sequelize.define('tblPersonals', {
        personId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        family: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        nationalCode: {
            type: DataTypes.STRING(10),
        },
        idNumber: {
            type: DataTypes.STRING(10),
        },
        sex: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        birthDate: {
            type: DataTypes.DATE,
        },
        birthPlace: {
            type: DataTypes.STRING(500),
        },
        personType: {
            type: DataTypes.ENUM("1", "2", "3"),
            defaultValue: "1",
            allowNull: false,
        },
        personPhoto: {
            type: DataTypes.BLOB,
            allowNull: true,
        },
        secretCode: {
            type: DataTypes.STRING(30),
        },
        isActive:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },{
        schema: 'CMS',
        uniqueKeys: {
            uniqueItems: { fields: ['personType', 'nationalCode'] }
        }
    });

    return tblPersonal;
}



