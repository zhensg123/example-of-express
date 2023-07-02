const express = require('express')
require('express-async-errors');
const router = require('./router')
const fs = require('fs')
const https = require('https')

const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
const path = require('path')

const bodyParser = require('body-parser')
const cors = require('cors')

const fileUpload = require('express-fileupload');

// 创建 express 应用
const app = express()

app.use(fileUpload({
    limits: { fileSize: 600 * 1024 * 1024 },
}));
app.use(express.json({limit: '600mb'}));
app.use(express.urlencoded({limit: '5600mb'}));

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

 
// 配置 swagger-jsdoc
const options = {
    definition: {
        // swagger 采用的 openapi 版本 不用改
        openapi: '3.0.0',
        // swagger 页面基本信息 自由发挥
        info: {
            title: 'Codejoy API Server',
            version: '1.0.0',
        }
    },
    // 重点，指定 swagger-jsdoc 去哪个路由下收集 swagger 注释
    apis: [path.join(__dirname, '/router/*.js')]
}

const swaggerSpec = swaggerJSDoc(options)

// 开放 swagger 相关接口，
app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// 使用 swaggerSpec 生成 swagger 文档页面，并开放在指定路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', router)

const server = app.listen(5000, function() {
    const host = server.address().address
    const port = server.address().port

    console.log('HTTP Server is running on http://%s:%s', host, port)
})
