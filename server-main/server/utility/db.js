const db = require("../config/dbIndex");
const { initSocket } = require("./socket.js/initSocket");
const initialize = async () => {
  await db.sequelize
    .sync()  
    .then(async () => {
      console.log("Connection to DB established successfully");
      await defineRoles();
    })
    .catch((error) => console.log("Unable to connect to the DB", error)).then(async()=>{
        const socket = await initSocket()
        const { data } = await socket.axios.get("http://31.7.74.193:3000/api/");
        console.log("Middleware is connected,", data.msg || data.result, ":)");
    }).catch((error)=> console.log("Middleware can't connect to fabric SDK :(\n", error.message))
};

const defineRoles = async () => {
  try {
    const Role = db.tblRole;
    await Role.bulkCreate([
      { roleId: 1, faName: "ادمین", enName: "ADMIN" },
      { roleId: 2, faName: "حسابدار", enName: "AID" },
      { roleId: 3, faName: "مددکار", enName: "ACCOUNTANT" },
    ]);
  } catch {}
};

/**
 * this is another initialize method which drops all the existing tables
 * and create new tables based on new models, whenever DB config is equal to "sequelizeDB"
 * WARNING: All data will be lost!
 */
// const {DB} = require("../config/dbConfig");
// let rebuildTables = false;
// const initialize = async () => {
//     if(DB === "sequelizeDB") rebuildTables = true;
//     await db.sequelize.sync({force: rebuildTables})
//         .then(async () => {
//             console.log('Connection to DB established successfully');
//             await defineRoles();
//         })
//         .catch(error => console.log('Unable to connect to the DB ', error))

// };

module.exports = { initialize };
