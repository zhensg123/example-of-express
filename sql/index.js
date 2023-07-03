const debug = require('../utils/constant').debug
var User = require('./tables').User;

async function insertData(TableName, data) {
    return await TableName.create(data);

}

async function deleteData(TableName, whereObj) {
    return await TableName.destroy({
        where: whereObj
    });
}

async function updateData(TableName, data, whereObj) {
    whereObj = whereObj || {}
    data = data || {}
    await TableName.update(data, {
        where: whereObj
    });
}

async function findByPk(TableName, id) {
    const inst = (async() => {
        return await TableName.findByPk(id)
    })();
    return inst;
}

async function findData(TableName, whereObj, pageNo) {
    whereObj = whereObj || {}
    const size = 10; // 每页10条数据
    const page = pageNo || 1; // 页数
    const { count, rows } = (async() => {
        return await TableName.findAndCountAll({
            where: whereObj,
            limit: size,
            offset: size * (page - 1)
        });
    })();
    return { count, rows };
}

async function findAll(TableName, whereObj, includeObj, isRaw) {
    whereObj = whereObj || {}
    isRaw = isRaw || false
    var obj = {
        where: whereObj,
        raw: isRaw
    }
    if (includeObj) {
        obj.include = includeObj
    }
    const rows = await TableName.findAll(obj)
    return rows
}

async function findOne(TableName, whereObj, includeObj) {
    whereObj = whereObj || {}
    const row = await TableName.findOne({
        where: whereObj,
        include: includeObj
    })
    return row
}

async function increment(TableName, id, field) {
    const obj = await TableName.findByPk(id);
    if (obj) {
        const result = await obj.increment(field);
    }
}

async function decrement(TableName, id, field) {
    const obj = await TableName.findByPk(id);
    if (obj) {
        const result = await obj.decrement(field);
    }
}

module.exports = {
    insertData,
    deleteData,
    updateData,
    findByPk,
    findData,
    findAll,
    findOne,
    increment,
    decrement
}