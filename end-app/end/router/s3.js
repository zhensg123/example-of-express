const Result = require('../models/Result')

var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'cn-northwest-1',
    accessKeyId: "AKIA2ISVUAHMV7TX7TZ5",
    secretAccessKey: "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",
});
// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

const getUploadedFileData = (file) => ({
    md5: file.md5,
    name: file.name,
    size: file.size,
    uploadPath: path.join(uploadDir, file.name),
    uploadDir: uploadDir
});

function syncS3File(url) {
    var fileKey = url;
    var options = {
        Bucket    : 'huidefen-codejoynew',
        Key    : fileKey,
    };
    var fileStream = s3.getObject(options).createReadStream();

    var uploadParams = {
        Bucket: 'huidefen-codejoynew-open', 
        Key: fileKey, 
        Body: fileStream
    };

    // call S3 to retrieve upload file to specified bucket
    s3.upload (uploadParams, function (err, data) {
        if (err) {
            console.log('文件从codejoy迁移到codejoyopen失败:' + err)
        } if (data) {
        }
    });
}


module.exports={
    s3,
    syncS3File,
    getUploadedFileData,
}
