module.exports = {
  HOST: '192.168.9.72',
  PASSWORD: 'root@1400',
  // DB: 'sequelizeDB',
  // DB: "sunyarDB",
  // DB: 'sunyarStage', 
  DB:'sunyarDev',

  

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

