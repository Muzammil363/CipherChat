import bcrypt from "bcrypt";
import { userInitialization } from "../utils/userInit.js";
import { User } from "../models/User.js";
import { authCookieOptions, generateAccessToken } from "../utils/jwt.js";

const publicProfile = (user) => ({
    email: user.email,
    fullName: user.fullName,
    profilePic: user.profilePic,
    publicKey: user.publicKey
});

const setAuthCookie = (res, email) => {
    const token = generateAccessToken(email);
    res.cookie("authToken", token, authCookieOptions());
};

export const signup = async (req, res) => {
    try {
        const { email, fullName, password, publicKey } = req.body;

        if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }
        if (!fullName) {
            return res.status(400).json({ message: "Full name required" });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password should be atleast 6 characters long" });
        }
        if (!publicKey || publicKey.length < 6) {
            return res.status(400).json({ message: "Bad credentials" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const user = await userInitialization(email, fullName, password, publicKey);
        setAuthCookie(res, email);
        return res.status(201).json({ message: "Created new account", user: publicProfile(user) });
    } catch (error) {
        console.error("Signup failed", error);
        return res.status(500).json({ message: "Some error occured on server side" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User Not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        await User.findOneAndUpdate({ email }, { status: "online" }, { new: true });
        setAuthCookie(res, email);
        return res.status(200).json({ message: "logged in", user: publicProfile(user) });
    } catch (error) {
        console.error("Login failed", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        if (req.user) {
            await User.findOneAndUpdate(
                { email: req.user },
                { status: "offline", lastSeen: Date.now() },
                { new: true }
            );
        }

        res.clearCookie("authToken", authCookieOptions());
        return res.status(200).json({ message: "logged out" });
    } catch (error) {
        console.error("Logout failed", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const check = (req, res) => {
    return res.status(200).json({
        message: "authenticated",
        user: publicProfile(req.authUser)
    });
};
