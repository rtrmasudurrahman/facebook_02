import jwt from "jsonwebtoken";

/*
 * create JWT token
 */

export const createToken = (payload, exp) => {
  //create new token
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: exp,
  });
  return token;
};

/*
 *  token verify
 */

export const tokenVerify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
