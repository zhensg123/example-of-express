// Load the 适用于 JavaScript 的开发工具包
var AWS = require('aws-sdk');
// Set the Region 
AWS.config.update({region: 'cn-northwest-1'});

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Call S3 to list the buckets
s3.listBuckets(function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Buckets);
  }
});

// Create the parameters for calling listObjects
var bucketParams = {
    Bucket : 'huidefen-codejoynew',
  };
  
// Call S3 to obtain a list of the objects in the bucket
s3.listObjects(bucketParams, function(err, data) {
if (err) {
    console.log("Error", err);
} else {
    console.log("Success", data);
}
});

var options = {
    Bucket    : 'huidefen-codejoynew',
    Key    : 'Report.xlsx',
};

// res.attachment(fileKey);
var fileStream = s3.getObject(options).createReadStream();
console.log(fileStream)