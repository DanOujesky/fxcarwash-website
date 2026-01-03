import { prisma } from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../utils/mailer.js";

const setNewPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user || user.resetCode !== code) {
    return res
      .status(400)
      .json({ error: "Neplatný ověřovací kód", valid: false });
  }

  if (new Date() > user.resetCodeExpiration) {
    return res.status(400).json({ error: "Kód již vypršel", valid: false });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { email: email },
    data: {
      password: hashedPassword,
      resetCode: null,
      resetCodeExpiration: null,
    },
  });

  res.status(200).json({
    status: "success",
    message: "Heslo bylo úspěšně změněno",
  });
};

const verifyResetCode = async (req, res) => {
  const { email, code } = req.body;
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user || user.resetCode !== code) {
    return res
      .status(400)
      .json({ error: "Neplatný ověřovací kód", valid: false });
  }

  if (new Date() > user.resetCodeExpiration) {
    return res.status(400).json({ error: "Kód již vypršel", valid: false });
  }
  res.status(200).json({ status: "success", valid: true });
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(200).json({
      error: "Žádný uživatel nebyl nenalezen s tímto emailem",
      exists: false,
    });
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.user.update({
    where: { email: email },
    data: {
      resetCode: resetCode,
      resetCodeExpiration: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  try {
    await sendVerificationEmail(email, resetCode);
    res.status(200).json({
      status: "success",
      message: "Kód pro obnovení hesla byl odeslán na váš email",
      exists: true,
      email: email,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to send verification email",
      details: error.message,
    });
  }
};

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res
      .status(400)
      .json({ error: "User already exists with this email" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    status: "success",
    data: { user: { email: newUser.email } },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = generateToken(user.id, res);
  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        email: user.email,
      },
      token: token,
    },
  });
};

const logout = async (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(0),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
};

const getMe = (req, res) => {
  res.status(200).json({ status: "success", user: req.user });
};

export {
  register,
  login,
  logout,
  getMe,
  requestPasswordReset,
  verifyResetCode,
  setNewPassword,
};
