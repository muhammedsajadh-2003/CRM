import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const signUp = async (req, res) => {
  const { firstName, lastName, role = "employee", email, password } = req.body;

  const missingFields = ["firstName", "lastName", "email", "password"].filter(
    (field) => !req.body[field]
  );

  if (missingFields.length) {
    return res.status(400).json({
      success: false,
      message: `All field are required, Missing fields: ${missingFields.join(
        ", "
      )}`,
    });
  }

  if (password.length > 8) {
    return res.status(400).json({
        success: false,
        message:"Password must be at least 8 charactres long"
    });
  }

  if (
    ![
      "admin",
      "employee",
      "sales_manager",
      "sales_representative",
      "project_manager",
    ].includes(role)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalied role",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword,
    });

    res.status(201).json({ success: true, message: "sign up success" });
  } catch (error) {
    console.error("signUp Error:", error);
    res.status(500).json({ success: false, message: "internal Server Error" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res
        .status(401)
        .json({ success: false, message: "invalied email or password" });
    }

    const token = generateToken(user._id, user.role);

    const { password: _, _id:id, ...userData } = user._doc;

    res
      .status(200)
      .cookie("access_token", token)
      .json({
        success: true,
        message: "sign In success",
        user: { ...userData, id },
      });
  } catch (error) {
    console.error("Sign In Error", error);
    res.status(500).json({ success: false, message: "internal Server Error" });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("access_token");
    return res.status(200).json({ success: true, message: "SignOut success" });
  } catch (error) {
    console.error("Sign Out Error:", error);
    return res.status(500).json({ success: false, message: "internal Server Error" });
  }
};
