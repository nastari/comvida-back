import { auth } from '../config/auth';

const jwt = require('jsonwebtoken');
const { promisify } = require('util');

export default async function authMiddle(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Token not provided.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, auth.secret);
    req.userId = decoded.id;
    return next();
  } catch (error) {
    res.status(401).json('Token invalid.');
  }
}
