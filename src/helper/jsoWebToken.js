const jwt = require('jsonwebtoken');

const createJSONWebToken = (payload, secretKay, expiresIn) => {
  if (typeof payload !== 'object' || !payload) {
    throw new Error('Payload must be a non empty object');
  }
  if (typeof secretKay !== 'string' || secretKay === '') {
    throw new Error('Secret key must be a non empty string');
  }
  try {
    const token = jwt.sign(payload, secretKay, { expiresIn });
    return token;
  } catch (error) {
    console.error('Fail to sign the JWT', error);
    throw error;
  }
};

module.exports = { createJSONWebToken };
