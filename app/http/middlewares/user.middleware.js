const cookieParser = require("cookie-parser");
const createHttpError = require("http-errors");
const JWT = require("jsonwebtoken");
const { UserModel } = require("../../models/user");

async function verifyAccessToken(req, res, next) {
  try {
    const accessToken = req.signedCookies["accessToken"];
    if (!accessToken) {
      throw createHttpError.Unauthorized("Please log in to your account.");
    }
    const token = cookieParser.signedCookie(
      accessToken,
      process.env.COOKIE_PARSER_SECRET_KEY
    );
    JWT.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      async (err, payload) => {
        try {
          if (err) throw createHttpError.Unauthorized("The token is invalid");
          const { _id } = payload;
          const user = await UserModel.findById(_id, {
            password: 0,
            otp: 0,
          });
          if (!user) throw createHttpError.Unauthorized("Account not found");
          req.user = user;
          return next();
        } catch (error) {
          next(error);
        }
      }
    );
  } catch (error) {
    next(error);
  }
}

async function isVerifiedUser(req, res, next) {
  try {
    const user = req.user;
    if (user.status === 1) {
      throw createHttpError.Forbidden("Your profile is under review.");
    }
    if (user.status !== 2) {
      throw createHttpError.Forbidden("Your profile has not been approved.");
    }
    return next();
  } catch (error) {
    next(error);
  }
}

function decideAuthMiddleware(req, res, next) {
  const accessToken = req.signedCookies["accessToken"];
  if (accessToken) {
    return verifyAccessToken(req, res, next);
  }
  next();
}

function setAccessToken(res, user) {
  const accessToken = JWT.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1h' });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    signed: true,
    secure: true, 
    sameSite: "None", 
    maxAge: 60 * 60 * 1000, 
  });
}

function setRefreshToken(res, user) {
  const refreshToken = JWT.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    signed: true,
    secure: true, 
    sameSite: "None", 
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
}

module.exports = {
  verifyAccessToken,
  decideAuthMiddleware,
  isVerifiedUser,
  setAccessToken,
  setRefreshToken,
};
