const { generateToken } = require("../config/jwt");
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

async function register(req, res) {
  let { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(401).json({ message: "Invalid email format" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await userModel.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });
    const token = generateToken({ id: user._id });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return res
      .status(201)
      .json({ message: "User registered successfully", user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    console.error("Error checking existing user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
async function login(req, res){
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({message: "All fields are required"})
    }
    try{
        const user = await userModel.findOne({email: email.trim().toLowerCase()})
        if(!user){
            return res.status(400).json({message: "Invalid email or password"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"})
        }
        const token  = generateToken({id: user._id})
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge:  24 * 60 * 60 * 1000, // 1 day
        })
        return res.status(200).json({message: "Login successful", user: {id: user._id, name: user.name, email: user.email}, token})
    }
    catch(err){
        console.error("Error during login:", err)
        return res.status(500).json({message: "Internal server error"})
    }
}
function logout(req, res){
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    })
    return res.status(200).json({message: "Logout successful"})
}
async function getProfile(req, res){
    const userId = req.user.id
    try{
        const user = await userModel.findById(userId).select("-password")
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        return res.status(200).json({user})
    }catch(err){
        console.error("Error fetching user profile:", err)
        return res.status(500).json({message: "Internal server error"})
    }
}
module.exports = {register, login, logout, getProfile}