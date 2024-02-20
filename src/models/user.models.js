import { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    fullName: {
      type: "string",
      required: [true, "Nmae is required"],
      minLength: [5, "Name should be atleast 5 Characters"],
      maxLength: [50, "Name should be atmost 5 Characters"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: "string",
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    avatar: {
      public_id: {
        type: "string",
      },
      secure_url: {
        type: "string",
      },
    },
    // authorize role
    role: {
      type: "string",
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async (next) => {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
  generateJWTToken: async function () {
    // Ensure process.env.JWT_SECRET and process.env.JWT_EXPIRY are defined in your environment
    const token = jwt.sign(
      {
        id: this._id,
        email: this.email,
        subscription: this.subscription,
      },
      process.env.JWT_SECRET, // Secret key for signing the token
      {
        expiresIn: process.env.JWT_EXPIRY, // Token expiry time
      }
    );
    return token; // Return the signed JWT
  },
  comparePassword: async function (plainTextPassword) {
    return await bcrypt.compare(plainTextPassword, this.password);
  },
  generatePasswordResetToken: (req, res) => {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;

    return resetToken;
  },
};

const User = model("User", userSchema);

export default User;
