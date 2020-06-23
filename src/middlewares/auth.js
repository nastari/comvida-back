const jwt = require('jsonwebtoken');
const { promisify } = require('util');

export default async function authMiddle(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Token not provided.' });
  }

  const [, token] = authHeader.split(' ');
  console.log(token);
  try {
    const decoded = await promisify(jwt.verify)(
      token,
      '0d7fd6618bd44c8b57cd492556280201'
    );
    req.userId = decoded.id;
    return next();
  } catch (error) {
    res.status(401).json('Token invalid.');
  }
}
