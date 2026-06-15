import bcrypt from "bcrypt"

import { User } from "../models/User.js"

export const userInitialization = async (email, fullName, password,publicKey) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return User.create({
        email,
        fullName,
        password: hashedPassword,
        publicKey:publicKey,
        status:"online"
    });
}

