import User from "../models/User.js";
import createError from "../utility/createError.js";
import { hashPassword, passwordVerify } from "../utility/hash.js";
import { getRan } from "../utility/math.js";
import {
  sendActivationLink,
  sendPasswordForgotLink,
} from "../utility/sendMail.js";
import { createToken, tokenVerify } from "../utility/token.js";
import { isEmail, isMobile } from "../utility/validate.js";
import { sendOTP } from "../utility/sendSms.js";

/**
 * @access public
 * @ route /api/user/register
 * @ method POST
 */
export const register = async (req, res, next) => {
  try {
    //get form data
    const {
      first_name,
      sur_name,
      auth,
      password,
      birth_date,
      birth_month,
      birth_year,
      gender,
    } = req.body;

    // //validate
    if (!first_name || !sur_name || !auth || !password || !gender) {
      next(createError(401, "All fields are required"));
    }

    //initial auth value
    let emailData = null;
    let mobileData = null;

    if (isEmail(auth)) {
      emailData = auth;
      const emailCheck = await User.findOne({ email: auth });

      if (emailCheck) {
        return next(createError(400, "Email already exists"));
      }
    } else if (isMobile(auth)) {
      mobileData = auth;
      const mobileCheck = await User.findOne({ mobile: auth });

      if (mobileCheck) {
        return next(createError(400, "Mobile already exists"));
      }
    } else {
      return next(createError(400, "Invalid email or mobile"));
    }

    // create access token
    let activation_code = getRan(10000, 99999);

    // check activation code
    let checkCode = await User.findOne({ access_token: activation_code });
    if (checkCode) {
      activation_code = getRan(10000, 99999);
    }

    const user = await User.create({
      first_name,
      sur_name,
      email: emailData,
      mobile: mobileData,
      password: hashPassword(password),
      birth_date,
      birth_month,
      birth_year,
      gender,
      access_token: activation_code,
    });

    if (user) {
      if (emailData) {
        // create activation token
        const activationToken = createToken({ id: user._id }, "30d");

        // create activation mail
        sendActivationLink(user.email, {
          name: user.first_name + " " + user.sur_name,
          link: `${
            process.env.APP_URL + ":" + process.env.PORT
          }/api/v1/user/activate/${activationToken}`,
          code: activation_code,
        });

        //send response with cookie for eamil
        res
          .status(200)
          .cookie("otp", user.email, {
            expires: new Date(Date.now() + 1000 * 60 * 60),
          })
          .json({
            message: "User created successfully",
            user: user,
          });
      }
      if (mobileData) {
        // create activation OTP
        sendOTP(
          user.mobile,
          ` Hi, ${user.first_name} ${user.sur_name}, Your activation OTP is= ${activation_code}`
        );

        //send response with cookie for eamil
        res
          .status(200)
          .cookie("otp", user.mobile, {
            expires: new Date(Date.now() + 1000 * 60 * 60),
          })
          .json({
            message: "User created successfully",
            user: user,
          });
      }
    }
  } catch (error) {
    next(error);
  }
};
/**
 * @access public
 * @ route /api/user/resend activate
 * @ method POST
 */

export const resendActivation = async (req, res, next) => {
  const { auth } = req.body;

  try {
    //initial auth value
    let emailData = null;
    let mobileData = null;
    let emailCheck;
    let mobileCheck;

    if (isEmail(auth)) {
      emailData = auth;
      emailCheck = await User.findOne({ email: auth });

      if (!emailCheck) {
        return next(createError(400, "Email user account not found"));
      }
      if (emailCheck.isActivate) {
        return next(createError(400, "Email user account already acivate"));
      }
    } else if (isMobile(auth)) {
      mobileData = auth;
      mobileCheck = await User.findOne({ mobile: auth });

      if (!mobileCheck) {
        return next(createError(400, "Mobile user account not found"));
      }
      if (mobileCheck.isActivate) {
        return next(createError(400, "Mobile user account already activate"));
      }
    } else {
      return next(createError(400, "Invalid email or mobile"));
    }

    // create access token
    let activation_code = getRan(10000, 99999);

    // check activation code
    let checkCode = await User.findOne({ access_token: activation_code });

    if (checkCode) {
      activation_code = getRan(10000, 99999);
    }

    //resend OTP
    if (mobileData) {
      sendOTP(
        mobileCheck.mobile,
        ` Hi, ${mobileCheck.first_name} ${mobileCheck.sur_name}, Your new activation OTP is ${activation_code}`
      );

      //update new link
      await User.findByIdAndUpdate(mobileCheck._id, {
        access_token: activation_code,
      });

      //send response with cookie for mobile
      res
        .status(200)
        .cookie("otp", mobileCheck.mobile, {
          expires: new Date(Date.now() + 1000 * 60 * 60),
        })
        .json({
          message: "New OTP code send successful",
        });
    }

    if (emailData) {
      const activationToken = createToken({ id: emailCheck._id }, "30d");

      // create activation mail
      sendActivationLink(emailCheck.email, {
        name: emailCheck.first_name + " " + emailCheck.sur_name,
        link: `${
          process.env.APP_URL + ":" + process.env.PORT
        }/api/v1/user/activate/${activationToken}`,
        code: activation_code,
      });

      //update new link
      await User.findByIdAndUpdate(emailCheck._id, {
        access_token: activation_code,
      });

      //send response with cookie for eamil
      res
        .status(200)
        .cookie("otp", emailCheck.email, {
          expires: new Date(Date.now() + 1000 * 60 * 60),
        })
        .json({
          message: "Activation link send",
        });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @access public
 * @ route /api/user/login
 * @ method POST
 */
export const login = async (req, res, next) => {
  try {
    const { auth, password } = req.body;
    //validate form
    if (isEmail(auth)) {
      const emailCheck = await User.findOne({ email: auth });

      if (!emailCheck) {
        return next(createError(400, "Email user not found"));
      } else {
        const userPass = passwordVerify(password, emailCheck.password);

        if (!userPass) {
          return next(createError(400, "Password not matched"));
        }
        if (userPass) {
          const token = createToken({ id: emailCheck._id }, "365d");

          return res.status(200).cookie("authToken", token).json({
            message: "User login successfully",
            user: emailCheck,
            token: token,
          });
        }
      }
    } else if (isMobile(auth)) {
      const mobileCheck = await User.findOne({ mobile: auth });

      if (!mobileCheck) {
        return next(createError(400, "Mobile user not found"));
      } else {
        const userPass = passwordVerify(password, mobileCheck.password);

        if (!userPass) {
          return next(createError(400, "Password not matched"));
        }
        if (userPass) {
          const token = createToken({ id: mobileCheck._id }, "365d");

          return res.status(200).cookie("authToken", token).json({
            message: "User login successfully",
            user: mobileCheck,
            token: token,
          });
        }
      }
    } else {
      return next(createError(400, "Invalid email or mobile"));
    }

    /////////////////////////////////////////
    // const loginUser = await User.findOne({ email: auth });

    // if (!loginUser) {
    //   next(createError(400, "login user not found!"));
    // } else {
    //   if (!passwordVerify(password, loginUser.password)) {
    //     next(createError(400, "wrong password"));
    //   } else {
    //     const token = createToken({ id: loginUser._id }, "365d");

    //     res.status(200).cookie("authToken", token).json({
    //       message: "User login successfully",
    //       user: loginUser,
    //       token: token,
    //     });
    //   }
    // }
  } catch (error) {
    next(error);
  }
};

/**
 * @access public
 * @ route /api/user/me
 * @ method GET
 */
export const loggedInUser = async (req, res, next) => {
  try {
    const auth_token = req.headers.authorization;

    if (!auth_token) {
      return next(createError(400, "Token not found"));
    }
    if (auth_token) {
      const token = auth_token.split(" ")[1];
      const user = tokenVerify(token);

      if (!user) {
        return next(createError(400, "Invalid token"));
      }
      if (user) {
        const loggedInUser = await User.findById(user.id);

        if (!loggedInUser) {
          return next(createError(400, "User data not match"));
        } else {
          res.status(200).json({
            message: "user data stable",
            user: loggedInUser,
          });
        }
      }
    }
  } catch (error) {
    next(error);
  }
};
/*
 * account activate by email
 *
 */
export const activateAccount = async (req, res, next) => {
  try {
    //get token
    const { token } = req.params;

    if (!token) {
      next(createError(400, "Invalid activation url"));
    } else {
      // verify token
      const tokenData = tokenVerify(token);

      if (!tokenData) {
        next(createError(400, "Activation url invalid!"));
      }
      if (tokenData) {
        const account = await User.findById(tokenData.id);

        if (account.isActivate === true) {
          next(createError(400, "Account already activate"));
        } else {
          await User.findByIdAndUpdate(tokenData.id, {
            isActivate: true,
            access_token: "",
          });

          res.status(200).json({
            message: "Account activate successful",
          });
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Account activate by code
 */

export const activateAccountByCode = async (req, res, next) => {
  try {
    const { code, email } = req.body;

    const user = await User.findOne().or([{ email: email }, { mobile: email }]);

    if (!user) {
      next(createError(404, "Activation user not found!"));
    } else {
      if (user.isActivate) {
        next(createError(404, "User account already activate"));
      } else {
        if (user.access_token !== code) {
          next(createError(404, "OTP code not matched"));
        }
        if (user) {
          await User.findByIdAndUpdate(user._id, {
            isActivate: true,
            access_token: "",
          });
          res.status(200).json({
            message: "user account activation successful",
          });
        }
      }
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * forgot password
 *
 */

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      next(createError(404, "User notfound"));
    }
    if (user) {
      const passwordResetToken = createToken({ id: user._id }, "30m");

      // create access token
      const activation_code = getRan(10000, 99999);

      // check activation code
      let checkCode = await User.findOne({ access_token: activation_code });
      if (checkCode) {
        activation_code = getRan(10000, 99999);
      }

      // create activation code
      sendPasswordForgotLink(user.email, {
        name: user.first_name + " " + user.sur_name,
        link: `${
          process.env.APP_URL + ":" + process.env.PORT
        }/api/v1/user/forgot-password/${passwordResetToken}`,
        code: activation_code,
      });
      await User.findByIdAndUpdate(user._id, {
        access_token: activation_code,
      });

      res.status(200).json({
        message: "A password reset link has sent to your account",
      });
    }
  } catch (error) {
    next(error);
  }
};
/*
 * Password Reset action
 *
 */
export const passwordResetAction = async (req, res, next) => {
  try {
    //get token
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      next(createError(400, "Invalid password reset url"));
    } else {
      // verify token
      const tokenData = tokenVerify(token);

      if (!tokenData) {
        next(createError(400, "Activation url invalid!"));
      }
      if (tokenData) {
        const user = await User.findById(tokenData.id);

        if (!user) {
          next(createError(400, "Invalid Reset Url"));
        }

        if (user) {
          await User.findByIdAndUpdate(user._id, {
            password: hashPassword(password),
            access_token: "",
          });
          res.status(200).json({
            message: "password changed successfully!",
          });
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

/*
 * find user account for password reset
 **/

export const findUserAccount = async (req, res, next) => {
  const { auth } = req.body;

  try {
    //initial auth value
    let emailData = null;
    let mobileData = null;

    if (isEmail(auth)) {
      emailData = auth;
      const emailCheck = await User.findOne({ email: auth });

      if (!emailCheck) {
        return next(createError(400, "Email user not found"));
      } else {
        return res
          .status(200)
          .cookie(
            "findUser",
            JSON.stringify({
              name: emailCheck.first_name + " " + emailCheck.sur_name,
              photo: emailCheck.profile_photo,
              email: emailCheck.email,
            }),
            {
              expires: new Date(Date.now() + 1000 * 60 * 60),
            }
          )
          .json({
            user: emailCheck,
          });
      }
    } else if (isMobile(auth)) {
      mobileData = auth;
      const mobileCheck = await User.findOne({ mobile: auth });

      if (!mobileCheck) {
        return next(createError(400, "Mobile user not found"));
      } else {
        return res
          .status(200)
          .cookie(
            "findUser",
            JSON.stringify({
              name: mobileCheck.first_name + " " + mobileCheck.sur_name,
              photo: mobileCheck.profile_photo,
              mobile: mobileCheck.mobile,
            }),
            {
              expires: new Date(Date.now() + 1000 * 60 * 60),
            }
          )
          .json({
            user: mobileCheck,
          });
      }
    } else {
      return next(createError(400, "Invalid email or mobile"));
    }
  } catch (error) {
    next(error);
  }
};
/**
 *
 * send password reset by otp /link
 *
 */
export const sendPasswordResetOTP = async (req, res, next) => {
  const { auth } = req.body;

  try {
    //initial auth value
    let emailData = null;
    let mobileData = null;
    let emailCheck;
    let mobileCheck;

    if (isEmail(auth)) {
      emailData = auth;
      emailCheck = await User.findOne({ email: auth });
    } else if (isMobile(auth)) {
      mobileData = auth;
      mobileCheck = await User.findOne({ mobile: auth });
    } else {
      return next(createError(400, "Invalid email or mobile"));
    }

    // create access token
    let activation_code = getRan(10000, 99999);

    // check activation code
    let checkCode = await User.findOne({ access_token: activation_code });

    if (checkCode) {
      activation_code = getRan(10000, 99999);
    }

    //resend OTP
    if (mobileData) {
      sendOTP(
        mobileCheck.mobile,
        ` Hi, ${mobileCheck.first_name} ${mobileCheck.sur_name}, Your new activation OTP is ${activation_code}`
      );

      //update new link
      await User.findByIdAndUpdate(mobileCheck._id, {
        access_token: activation_code,
      });

      //send response with cookie for mobile
      res
        .status(200)
        .cookie("otp", mobileCheck.mobile, {
          expires: new Date(Date.now() + 1000 * 60 * 60),
        })
        .json({
          message: "New OTP code send successful",
        });
    }

    //resend OTP
    if (mobileData) {
      sendOTP(
        mobileCheck.mobile,
        ` Hi, ${mobileCheck.first_name} ${mobileCheck.sur_name}, Your new activation OTP is ${activation_code}`
      );

      //update new link
      await User.findByIdAndUpdate(mobileCheck._id, {
        access_token: activation_code,
      });

      //send response with cookie for mobile
      res
        .status(200)
        .cookie("otp", mobileCheck.mobile, {
          expires: new Date(Date.now() + 1000 * 60 * 60),
        })
        .json({
          message: "New OTP code send successful",
        });
    }

    if (emailData) {
      const activationToken = createToken({ id: emailCheck._id }, "30d");

      // create activation mail
      sendActivationLink(emailCheck.email, {
        name: emailCheck.first_name + " " + emailCheck.sur_name,
        link: `${
          process.env.APP_URL + ":" + process.env.PORT
        }/api/v1/user/activate/${activationToken}`,
        code: activation_code,
      });

      //update new link
      await User.findByIdAndUpdate(emailCheck._id, {
        access_token: activation_code,
      });

      //send response with cookie for eamil
      res
        .status(200)
        .cookie("otp", emailCheck.email, {
          expires: new Date(Date.now() + 1000 * 60 * 60),
        })
        .json({
          message: "Activation link send",
        });
    }
  } catch (error) {
    next(error);
  }
};

/**
 *
 *check Password Reset OTP check
 *
 */

export const checkPasswordResetOTP = async (req, res, next) => {
  try {
    const { code, auth } = req.body;
    if (isEmail(auth)) {
      const userData = await User.findOne().where("email").equals(auth);

      if (!userData) {
        return next(createError(400, "Invalid user request"));
      }
      if (userData) {
        if (userData.access_token != code) {
          return next(createError(400, "Invalid OTP code"));
        }
        if (userData.access_token == code) {
          return res
            .status(200)
            .cookie("cpid", userData._id.toString(), {
              expires: new Date(Date.now() + 1000 * 60 * 60),
            })
            .cookie("cpcode", code, {
              expires: new Date(Date.now() + 1000 * 60 * 60),
            })
            .status(200)
            .json({
              message: "you can change your password",
            });
        }
      }
    } else if (isMobile(auth)) {
      const userData = await User.findOne().where("mobile").equals(auth);

      if (!userData) {
        return next(createError(400, "Invalid user request"));
      }
      if (userData) {
        if (userData.access_token != code) {
          return next(createError(400, "Invalid OTP code"));
        }
        if (userData.access_token == code) {
          return res
            .status(200)
            .cookie("cpid", userData._id.toString(), {
              expires: new Date(Date.now() + 1000 * 60 * 60),
            })
            .cookie("cpcode", code, {
              expires: new Date(Date.now() + 1000 * 60 * 60),
            })
            .status(200)
            .json({
              message: "you can change your password",
            });
        }
      }
    } else {
      return next(createError(400, "Invalid Mobile or Email"));
    }

    if (!userData) {
    }
  } catch (error) {
    next(error);
  }
};
/**
 *
 * Password Reset
 *
 */

export const passwordReset = async (req, res, next) => {
  try {
    const { id, password, code } = req.body;

    const userData = await User.findOne().and([
      { _id: id },
      { access_token: code },
    ]);
    if (!userData) {
      next(createError(400, "password change request failed"));
    }
    if (userData) {
      await User.findByIdAndUpdate(id, {
        password: hashPassword(password),
        access_token: null,
      });
      return res
        .clearCookie("cpcode")
        .clearCookie("cpid")
        .clearCookie("otp")
        .clearCookie("findUser")
        .status(200)
        .json({
          messgae: "password changed successful",
        });
    }
  } catch (error) {
    next(error);
  }
};
