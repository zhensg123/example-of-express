// const mongoose = require('mongoose');

// //const DB_URL = 'mongodb://localhost:27017/codejoy';
// const DB_URL ='mongodb+srv://fanzhao:zf940929@user-iig3a.mongodb.net/test?retryWrites=true&w=majority';

// mongoose.connect(DB_URL, { dbName: 'user_db', useNewUrlParser: true ,useUnifiedTopology: true});

// mongoose.connection.on('connected', () => {
//     console.log('数据库连接成功')
// })

// mongoose.connection.on('disconnected', () => {
//     console.log('数据库断开')
// })

// mongoose.connection.on('error', () => {
//     console.log('数据库连接异常')
// })

// // 将此文件作为一个模块 暴露出去，供别人调用
// module.exports = mongoose;

const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('codejoy', 'codejoy', 'KXcNMZRJZsiSCCmK', {
//     host: '127.0.0.1',
//     dialect: 'mysql'
// });

const sequelize = new Sequelize('imooc', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

module.exports = sequelize;
