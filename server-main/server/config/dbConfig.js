module.exports = {
  HOST: 'localhost', //192.168.9.72  //185.110.188.86  //82.115.16.181
  PASSWORD: '1', //root@1400 /1234
  // HOST: 'localhost',
  // PASSWORD: '1', 
  // DB: 'sequelizeDB',
  // DB: "sunyarDB",
  // DB: 'sunyarStage',  
  // DB:'sunyarDev', 
  // DB:'sunyarTest',
  DB: "SunyTest" ,
  // DB: "sun1",
  
  // HOST: 'localhost',
  // PASSWORD: 'saman136757',
  // DB: 'charitydb1',

  USER: 'postgres',
  dialect: 'postgres',
  port: 5432, 
 
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

