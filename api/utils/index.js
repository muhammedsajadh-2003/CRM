import jwt from "jsonwebtoken";

export const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if(!token){
    return res
      .status(401)
      .json({ message: "Unauthorized, Signin to contionue" });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Unauthorized, Signin to contionue" });
    }
    req.user = user;
    next();
  });
}