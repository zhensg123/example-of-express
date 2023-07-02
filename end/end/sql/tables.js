const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(256),
        allowNull: false,
        validate: {
            notNull: {
                msg: '名称不能为空'
            }
        }
    },
    introduce: DataTypes.STRING(4096),
    totalLesson: DataTypes.INTEGER,
    category: DataTypes.STRING,
    tag: DataTypes.STRING,
    cover: DataTypes.STRING,
}, {
    paranoid: true,
    tableName: 'course',
});

const Lesson = sequelize.define('Lesson', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: DataTypes.STRING(256),
    introduce: DataTypes.STRING(256),
    videoUrl: DataTypes.STRING(256),
    pptUrl: DataTypes.STRING(256),
    templateId: DataTypes.INTEGER,
    videoUrlStu: DataTypes.STRING(256),
    pptUrlStu: DataTypes.STRING(256),
    templateIdStu: DataTypes.INTEGER,
    cover: DataTypes.STRING,
    showUrl: DataTypes.STRING(256),

    introduceVideoUrl: DataTypes.STRING(256), // 课程介绍视频
    planUrl: DataTypes.STRING(256), // 教案
    ais: DataTypes.STRING(256), // ai互动数组，包括名字、链接地址
    resourcePackUrl: DataTypes.STRING(256), // 教师资源包
    stuAis: DataTypes.STRING(256), // ai互动数组，包括名字、链接地址
    resourceStuPackUrl:DataTypes.STRING(256), // 学生资源包
    platform:DataTypes.STRING(32),//平台

    templateNameStu:DataTypes.STRING(32),
    templateName:DataTypes.STRING(32),
    videoName: DataTypes.STRING(32),
    pptName: DataTypes.STRING(32),
    videoNameStu: DataTypes.STRING(32),
    pptNameStu: DataTypes.STRING(32),
    introduceVideoName: DataTypes.STRING(32),
    planName: DataTypes.STRING(32), 
    resourcePackName: DataTypes.STRING(32), 

}, {
    paranoid: true,
    tableName: 'lesson',
});

const LessonResource = sequelize.define('LessonResource', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name:DataTypes.STRING(256),
    url:DataTypes.STRING(1024),
    
},
{
    paranoid: true,
    tableName: 'lessonResource',
})

const Template = sequelize.define('Template', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(256),
        allowNull: false,
        validate: {
            notNull: {
                msg: '名称不能为空'
            }
        }
    },
    url: {
        type: DataTypes.STRING(1024),
        allowNull: false,
        validate: {
            notNull: {
                msg: '模板url不能为空'
            }
        }
    },
    info: DataTypes.STRING(1024),
    type: {
        type: DataTypes.ENUM(['scratch', 'python']),
        allowNull: false,
        validate: {
            notNull: {
                msg: '模板类型不能为空'
            }
        }
    }
}, {
    paranoid: true,
    tableName: 'template',
});

const UserCourse = sequelize.define('UserCourse', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    type: DataTypes.INTEGER,
    courseId: {
        type: DataTypes.INTEGER,
    },
    userId: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'user_course',
    indexes: [{
        unique: 'column',
        fields: ['userId', 'courseId']
    }]
});

const UserTemplateInst = sequelize.define('UserTemplateInst', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(256),
        allowNull: false,
        validate: {
            notNull: {
                msg: '名称不能为空'
            }
        }
    },
    templateId: {
        type: DataTypes.INTEGER,
    },
    userId: {
        type: DataTypes.INTEGER,
    },
    url: DataTypes.STRING(1024),
    projectThumbnail:DataTypes.STRING(1024),
    type: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    languageType: {
        type: DataTypes.ENUM(['scratch', 'python','makeBlock']),
        allowNull: false,
        defaultValue: 'scratch',
        validate: {
            notNull: {
                msg: '语言类型不能为空'
            }
        }
    },
    instructions: DataTypes.STRING(4096),
    remarks: DataTypes.STRING(4096),
    isShare: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
}, {
    paranoid: true,
    tableName: 'user_template_inst',
    // indexes: [
    //   {
    //       unique: true,
    //       fields: ['userId', 'templateId']
    //   }
    // ]
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    studentId:{
        type: DataTypes.STRING(256),
        allowNull: true,
        unique: 'column'
    },
    username: {
        type: DataTypes.STRING(256),
        allowNull: false,
        unique: 'column'
    },
    password: {
        type: DataTypes.STRING(256),
        allowNull: false,
    },
    firstName: DataTypes.STRING(256),
    lastName: DataTypes.STRING(256),
    experience: DataTypes.STRING(1024),
    roles: {
        type: DataTypes.STRING,
        get() {
            if (this.getDataValue('roles')) {
                return this.getDataValue('roles').split(';')
            }
            return [];
        },
        allowNull: false
    },
    avatar: DataTypes.STRING(1024),
    phone: DataTypes.STRING(32),
    phoneVerify: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    paranoid: true,
    tableName: 'user',
});


     
const ClassInfo = sequelize.define('ClassInfo', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    registerStuCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    activeStuCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    invitedCode:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '000000'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}, {
    paranoid: true,
    tableName: 'class_info',
});

const ClassInst = sequelize.define('ClassInst', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    studentStatus:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
    },
}, {
    tableName: 'class_inst',
    indexes: [
      {
          unique: 'column',
          fields: ['userId', 'classId']
      }
    ]
});

const TeacherStudent = sequelize.define('TeacherStudent', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

}, {
    tableName: 'teacher_student',
    indexes: [
    {
        unique: 'column',
        fields: ['teacherId', 'studentId']
    }]
});

const ClassCourse = sequelize.define('ClassCourse', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    recording:{
        type: DataTypes.STRING(4096),
        allowNull: true,
    }
}, {
    paranoid: true,
    tableName: 'class_course',

});

const Teaching = sequelize.define('Teaching', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lessonId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'planning'
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    comment:{
        type: DataTypes.STRING(4096),
        allowNull: true,
    },
    time:{
        type: DataTypes.STRING(4096),
        allowNull: true,
    }

},{
    paranoid: true,
    tableName: 'teaching',
    // indexes: [
    //   {
    //       fields: ['classId', 'courseId']
    //   }
    // ]
}
)

// const Teaching = sequelize.define('ClassCourse', {

// 课程和课时关系
Course.hasMany(Lesson, { foreignKey: 'courseId', allowNull: true });
Lesson.belongsTo(Course, { foreignKey: 'courseId', allowNull: true });
// 课时和资源的关系
// LessonResource
Lesson.hasMany(LessonResource, { foreignKey: 'lessonId', allowNull: true });
LessonResource.belongsTo(Lesson, { foreignKey: 'lessonId', allowNull: true });
// 用户和课程关系
User.hasMany(UserCourse, { foreignKey: 'userId' });
UserCourse.belongsTo(User, { foreignKey: 'userId' });
Course.hasMany(UserCourse, { foreignKey: 'courseId' });
UserCourse.belongsTo(Course, { foreignKey: 'courseId' });
// 用户和模板关系
User.hasMany(UserTemplateInst, { foreignKey: 'userId' });
UserTemplateInst.belongsTo(User, { foreignKey: 'userId' });
Template.hasMany(UserTemplateInst, { foreignKey: 'templateId' });
UserTemplateInst.belongsTo(Template, { foreignKey: 'templateId' });
// 用户和班级的关系
User.hasMany(ClassInst, { foreignKey: 'userId' });
ClassInst.belongsTo(User, { foreignKey: 'userId' });
ClassInfo.hasMany(ClassInst, { foreignKey: 'classId' });
ClassInst.belongsTo(ClassInfo, { foreignKey: 'classId' });
//老师用户与学生用户的关系
User.hasMany(TeacherStudent, { foreignKey: 'teacherId' });
User.hasMany(TeacherStudent, { foreignKey: 'studentId' });
// 课和教学的关系
Lesson.hasMany(Teaching, { foreignKey: 'lessonId' })
// 课程和教学的关系
Course.hasMany(Teaching, { foreignKey: 'courseId' });
// 班级和教学的关系
ClassInfo.hasMany(Teaching, { foreignKey: 'classId' });
// 班级和课程关系
Course.hasMany(ClassCourse, { foreignKey: 'courseId' });
ClassCourse.belongsTo(Course, { foreignKey: 'courseId' });
ClassInfo.hasMany(ClassCourse, { foreignKey: 'classId' });
ClassCourse.belongsTo(ClassInfo, { foreignKey: 'classId' });

(async() => {
    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");
})();

module.exports = {LessonResource,Teaching, Course, Lesson, Template, UserCourse, UserTemplateInst, User, ClassCourse, ClassInfo, ClassInst,TeacherStudent }
