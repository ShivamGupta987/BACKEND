import AppError from "../utils/error.utils.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

const CookieOptions = {
  maxAge: 60 * 60 * 24 * 1000,
  httponly: true,
  secure: true,
};

const register = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new AppError("All fields are mandatory", 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError("Emails already exists", 400));
  }
  // agr nhi hai toh create

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url: "https://ui-avatars.com/api/?name=John+Doe",
    },
  });

  if (!user) {
    return next(new AppError("users reqistered failed", 400));
  }
  // TODO file upload
  // file details ke loye

  console.log("fie details > ", JSON.stringify(req.file));

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "LMS-BACKEND",
        width: 250,
        height: 250,
        gravity: faces,
        crop: fill,
      });

      if (result) {
        (user.avatar.public_id = result.avatar.public_id),
          (user.avatar.secure_url = result.avatar.secure_url);

        fs.rm(`uploads/${req.file.filename}`);
        // alsop import fs
      }
    } catch (e) {
      return next(new AppError("file not uploaded try again", 400));
    }
  }

  await user.save();
  user.password = undefined;

  // token genrate

  const token = await user.generateJWTToken();

  // cookies

  res.cookie("token", token, CookieOptions);

  res.status(201).json({
    success: true,
    message: "USER Registered successfully",
    user,
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Email and passwoord required", 401));
    }
    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user || !user.comparePassword(password)) {
      return next(new AppError("Email and passwoord not match ", 401));
    }

    const token = await user.generateJWTToken();
    user.password = undefined;
    res.cookies("token", token, CookieOptions);
    res.status(200).json({
      success: true,
      message: "Loggd in Successfully",
      user,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const logout = (req, res) => {
  try {
    res.cookies("token", null, {
      secure: true,
      maxAge: 0,
      httpOnly: true,
    });

    res.status(200).jaon({
      success: true,
      message: "Logged out Successfully",
      user,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const getProfile = (req, res) => {
  try {
    const UserId = req.user.id;
    const user = User.findbyId(UserId);

    res.status(200).jaon({
      success: true,
      message: "Featch profile Successfully",
      user,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }

};
const forgotPassword= async(req,res) => {

  const {email} = req.body;

  if(!email) {
    return next(new AppError("Email is required ", 401));
  }

  const user = await User.findOne({email})

  if(!user){
    return next(new AppError("Email not reqistered ", 401));
  }

  const resetToken = await user.generatePasswordResetToken();

  await user.save();
  const resetPasswordURL = (resetToken) => {
    return `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  };
  
  try{
    await sendEmail(email, subject,message);

    res.status(200).json({
      success:true,
      message:`Reset Password hasbeen sent successfully to ${email}`
    })

  }catch(e){

    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;
 



    return next(new AppError(e.message, 401));

  }




}

const resetPassword=(req,res) => {
}

export { register, login, logout, getProfile,forgotPassword,resetPassword };
