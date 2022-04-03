var aws = require('aws-sdk')

const region = "us-west-2"
const bucketName ='upload-s3-bucket-1'
const accessKeyId='AKIAXBQK7SIGUS5YAOP7'
const secretAccessKey = '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'


const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})

async function generateUploadURL(imgname){

    const imageName = imgname

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL
}

module.exports = {generateUploadURL: generateUploadURL};