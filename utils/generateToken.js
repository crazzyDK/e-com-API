import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

export const generateReqToken = () => {
  return crypto.randomBytes(32).toString('hex');
}
// export const verifyToken = (token) => {
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return decoded;
//   } catch (error) {
//     throw new Error('Invalid token');
//   }
// }
