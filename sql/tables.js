const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const employee = sequelize.define('employee', {
    eno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    ename: {
        type: DataTypes.STRING(256),
        allowNull: false,
        validate: {
            notNull: {
                msg: '名称不能为空'
            }
        }
    },
    salary: DataTypes.INTEGER,
    dname: DataTypes.INTEGER,
    hiredate: DataTypes.DATE    // 可以用字符串进行更新   
}, {
    paranoid: true,  // paranoid表就是软删除而非硬删除机制的表
    tableName: 'employee',
    freezeTableName: true,
    timestamps: false
});





const students = sequelize.define('students', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING
}, {
    tableName: 'students'
});




(async() => {
    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");
})();

module.exports = { employee }
