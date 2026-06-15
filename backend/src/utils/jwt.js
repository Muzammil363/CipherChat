import jwt from "jsonwebtoken"
export const generateAccessToken=(email)=>{
    return jwt.sign({email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXP || "1d"});
}

export const authCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
        maxAge: Number(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE_MS) || 24 * 60 * 60 * 1000
    };
};
