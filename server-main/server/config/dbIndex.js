const dbConfig = require('./dbConfig');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    define: {
        // to remove createdAt and updatedAt
        timestamps: false
    },
    // operatorsAliases: false,
    logging: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
//--------------------------------------------------------------------
//-----CMS------------------------------------------------------------
//--------------------------------------------------------------------

db.tblPersonal = require('../cms/um/personal/model/personal')(sequelize, Sequelize);
db.tblUser = require('../cms/um/user/model/user')(sequelize, Sequelize);
db.tblRole = require('../cms/um/role/model/role')(sequelize, Sequelize);
db.tblSystemForm = require('../cms/um/accessPermission/model/systemForm')(sequelize, Sequelize);
db.tblAssignRoleToUser = require('../cms/um/role/model/assignRoleToUser')(sequelize, Sequelize);
db.tblAssignRoleToSystemForm = require('../cms/um/accessPermission/model/assignRoleToSystemForm')(sequelize, Sequelize);

db.tblUser.belongsTo(db.tblPersonal, { foreignKey: 'personId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
db.tblSystemForm.belongsTo(db.tblSystemForm, { as: 'parent', foreignKey: 'sysParentId', useJunctionTable: false, onDelete: 'NO ACTION' , onUpdate: 'NO ACTION'});
db.tblAssignRoleToUser.belongsTo(db.tblUser, { foreignKey: 'userId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' , allowNull: false});
db.tblAssignRoleToUser.belongsTo(db.tblRole, { foreignKey: 'roleId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' , allowNull: false});
db.tblAssignRoleToSystemForm.belongsTo(db.tblRole, { foreignKey: 'roleId',onDelete: 'NO ACTION', onUpdate: 'NO ACTION', allowNull: false });
db.tblAssignRoleToSystemForm.belongsTo(db.tblSystemForm, { foreignKey: 'systemFormId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' , allowNull: false});

//--------------------------------------------------------------------
//------SUNYAR--------------------------------------------------------
//--------------------------------------------------------------------

db.tblCommonBaseType = require('../sunyar/baseInfo/commonBaseType/model/commonBaseType')(sequelize, Sequelize);
db.tblCommonBaseData = require('../sunyar/baseInfo/commonBaseData/model/commonBaseData')(sequelize, Sequelize);
db.tblCharityAccounts = require('../sunyar/baseInfo/charityAccounts/model/charityAccounts')(sequelize, Sequelize);
db.tblNeedyAccounts = require('../sunyar/beneficiary/needyAccounts/model/needyAccounts')(sequelize, Sequelize);
db.tblPlan = require('../sunyar/plan/plan/model/plan')(sequelize, Sequelize);
db.tblAssignNeedyToPlan = require('../sunyar/plan/needyToPlan/model/needyToPlan')(sequelize, Sequelize);
db.tblCashAssistanceDetail = require('../sunyar/plan/succorCash/model/succorCash')(sequelize, Sequelize);
db.tblPayment = require('../sunyar/operation/payment/model/payment')(sequelize, Sequelize);


db.tblCommonBaseData.belongsTo(db.tblCommonBaseType, { foreignKey: {name : 'commonBaseTypeId' ,  allowNull: false } , onDelete: 'NO ACTION' , onUpdate: 'NO ACTION' })
db.tblCharityAccounts.belongsTo(db.tblCommonBaseData, { foreignKey: 'bankId' ,  onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
db.tblNeedyAccounts.belongsTo(db.tblPersonal, { foreignKey: 'needyId', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
db.tblNeedyAccounts.belongsTo(db.tblCommonBaseData, { foreignKey: 'bankId', onDelete: 'NO ACTION' , onUpdate: 'NO ACTION'})
db.tblPlan.belongsTo(db.tblPlan, { as: 'parent', foreignKey: 'parentPlanId', useJunctionTable: false, onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
db.tblAssignNeedyToPlan.belongsTo(db.tblPersonal, { foreignKey: 'needyId', onDelete: 'NO ACTION' , onUpdate: 'NO ACTION' })
db.tblAssignNeedyToPlan.belongsTo(db.tblPlan, { foreignKey: 'planId', onDelete: 'NO ACTION' , onUpdate: 'NO ACTION' })
db.tblCashAssistanceDetail.belongsTo(db.tblAssignNeedyToPlan, { foreignKey: 'assignNeedyPlanId', onDelete: 'NO ACTION' , onUpdate: 'NO ACTION'  })
db.tblCashAssistanceDetail.belongsTo(db.tblPlan, { foreignKey: 'planId' ,  onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
db.tblPayment.belongsTo(db.tblPersonal, { as: "donator", foreignKey: 'donatorId', onDelete: 'NO ACTION' , onUpdate: 'NO ACTION' })
db.tblPayment.belongsTo(db.tblPersonal, { as: "needy", foreignKey: 'needyId', onDelete: 'NO ACTION' , onUpdate: 'NO ACTION'  })
db.tblPayment.belongsTo(db.tblCashAssistanceDetail, { foreignKey: 'cashAssistanceDetailId', onDelete: 'NO ACTION' , onUpdate: 'NO ACTION'})
db.tblPayment.belongsTo(db.tblCharityAccounts, { foreignKey: 'charityAccountId', onDelete: 'NO ACTION' , onUpdate: 'NO ACTION'  })


module.exports = db;