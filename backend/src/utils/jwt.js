import jwt from "jsonwebtoken"
export const generateAccessToken=(email)=>{
    return jwt.sign({email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXP});
}

export const generateRefreshToken=(email)=>{
    return jwt.sign({email},process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXP})
}

export const verifyTokenAsync = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });
};

export const regenerate = async (refreshToken) => {
    try {
        const user = await verifyTokenAsync(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXP || "5m",
        });
        return { accessToken, user, err: null };
    } catch (err) {
        return { accessToken: null, user: null, err };
    }
};
