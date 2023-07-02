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
    hiredate: DataTypes.Date
}, {
    paranoid: true,  // paranoid表就是软删除而非硬删除机制的表
    tableName: 'employee',
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



// const Teaching = sequelize.define('ClassCourse', {

// // 课程和课时关系
// Course.hasMany(Lesson, { foreignKey: 'courseId', allowNull: true });
// Lesson.belongsTo(Course, { foreignKey: 'courseId', allowNull: true });
// // 课时和资源的关系
// // LessonResource
// Lesson.hasMany(LessonResource, { foreignKey: 'lessonId', allowNull: true });
// LessonResource.belongsTo(Lesson, { foreignKey: 'lessonId', allowNull: true });
// // 用户和课程关系
// User.hasMany(UserCourse, { foreignKey: 'userId' });
// UserCourse.belongsTo(User, { foreignKey: 'userId' });
// Course.hasMany(UserCourse, { foreignKey: 'courseId' });
// UserCourse.belongsTo(Course, { foreignKey: 'courseId' });
// // 用户和模板关系
// User.hasMany(UserTemplateInst, { foreignKey: 'userId' });
// UserTemplateInst.belongsTo(User, { foreignKey: 'userId' });
// Template.hasMany(UserTemplateInst, { foreignKey: 'templateId' });
// UserTemplateInst.belongsTo(Template, { foreignKey: 'templateId' });
// // 用户和班级的关系
// User.hasMany(ClassInst, { foreignKey: 'userId' });
// ClassInst.belongsTo(User, { foreignKey: 'userId' });
// ClassInfo.hasMany(ClassInst, { foreignKey: 'classId' });
// ClassInst.belongsTo(ClassInfo, { foreignKey: 'classId' });
// //老师用户与学生用户的关系
// User.hasMany(TeacherStudent, { foreignKey: 'teacherId' });
// User.hasMany(TeacherStudent, { foreignKey: 'studentId' });
// // 课和教学的关系
// Lesson.hasMany(Teaching, { foreignKey: 'lessonId' })
// // 课程和教学的关系
// Course.hasMany(Teaching, { foreignKey: 'courseId' });
// // 班级和教学的关系
// ClassInfo.hasMany(Teaching, { foreignKey: 'classId' });
// // 班级和课程关系
// Course.hasMany(ClassCourse, { foreignKey: 'courseId' });
// ClassCourse.belongsTo(Course, { foreignKey: 'courseId' });
// ClassInfo.hasMany(ClassCourse, { foreignKey: 'classId' });
// ClassCourse.belongsTo(ClassInfo, { foreignKey: 'classId' });

(async() => {
    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");
})();

module.exports = { employee,students }
