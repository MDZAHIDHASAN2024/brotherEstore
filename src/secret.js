require('dotenv').config();

const serverPort = process.env.SERVER_PORT || 30001;

const mongoDbURL =
  process.env.MONGODB_ATLAS_URL || 'mongodb://localhost:27017/jahidDB';

const defaultImgaPath = process.env.DEFAULT_IMAGE_PATH || 'public/images/users';

const jsonActivationKay =
  process.env.JWT_ACTIVATION_KAY || 'LASJLDFLAJDSLFSJDF_$%';
const jsonAccessKey = process.env.JWT_ACCESS_KEY || 'LASJLDFLAJDSLFSJDF_$%';

const smtpUserName = process.env.SMTP_USERNAME || '';
const smtpPassword = process.env.SMTP_PASSWORD || '';
const clientSite = process.env.CLIENT_SITE || '';

module.exports = {
  serverPort,
  mongoDbURL,
  defaultImgaPath,
  jsonActivationKay,
  smtpUserName,
  smtpPassword,
  clientSite,
  jsonAccessKey,
};
