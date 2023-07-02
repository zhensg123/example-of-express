const {Storage}  = require('@google-cloud/storage')
const GOOGLE_CLOUD_PROJECT_ID = 'codejoy-dev'; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = 'utils/codejoy-dev-google.json'; // Replace with the path to the downloaded private key

const storage = new Storage({
    projectId: GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: GOOGLE_CLOUD_KEYFILE,
});
const DEFAULT_BUCKET_NAME = 'scratch_file'; // Replace with the name of your bucket

/**
 * Get public URL of a file. The file must have public access
 * @param {string} bucketName
 * @param {string} fileName
 * @return {string}
 */
function getPublicUrl(bucketName, fileName) {
    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
}


function sendUploadToGCS(req, res, next){
    if (!req.file) {
        return next();
    }
    const bucketName = req.body.bucketName || DEFAULT_BUCKET_NAME;
    const bucket = storage.bucket(bucketName);
    const gcsFileName = `${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(gcsFileName);
    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype,
        },
    });
    stream.on('error', (err) => {
        req.file.cloudStorageError = err;
        next(err);
    });
    stream.on('finish', () => {
        req.file.cloudStorageObject = gcsFileName;
        return file.makePublic()
            .then(() => {
                req.file.gcsUrl = getPublicUrl(bucketName, gcsFileName);
                next();
            });
    });
    stream.end(req.file.buffer);
};

module.exports={
    sendUploadToGCS
}
