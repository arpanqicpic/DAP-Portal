const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// Initialize the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:  process.env.AWS_SECRET_ACCESS_KEY,
  }
});
// Function to generate a pre-signed URL for an S3 object
const getImageUrl = async (bucketName, foldername, fileName) => {
  const params = {
    Bucket: bucketName,
    Key: `${foldername}/${fileName}`,
  };
  try {
    // Create a GetObjectCommand to retrieve the file from S3
    const command = new GetObjectCommand(params);
    // Generate the pre-signed URL with an expiration time (optional)
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // Expires in 1 hour
    return url;
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw new Error('Error generating URL');
  }
};
module.exports= {getImageUrl}