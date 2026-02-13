
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { prismaClient } from "../db";
import { sendEmail } from "../email";
import { authMiddleware } from "../middleware";
import { SigninSchema, SignupSchema } from "../types";

const router = Router();

router.post("/signup", async (req, res) => {
    const body = req.body;
    const parsedData = SignupSchema.safeParse(body);

    if (!parsedData.success) {
        console.log(parsedData.error);
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const userExists = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username
        }
    });

    if (userExists) {
        return res.status(403).json({
            message: "User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

    const user = await prismaClient.user.create({
        data: {
            email: parsedData.data.username,
            password: hashedPassword,
            name: parsedData.data.name,
            verified: false
        }
    })

    const token = crypto.randomBytes(32).toString("hex");
    await prismaClient.verificationToken.create({
        data: {
            token,
            userId: user.id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
    })

    await sendEmail(
        user.email,
        "Verify your account",
        `Please verify your account by clicking here: ${process.env.FRONTEND_URL}/verify?token=${token}`
    );

    return res.json({
        message: "Please verify your account by checking your email"
    });

})

router.post("/verify", async (req, res) => {
    const { token } = req.body;
    const verificationToken = await prismaClient.verificationToken.findFirst({
        where: { token }
    });

    if (!verificationToken || verificationToken.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }

    await prismaClient.user.update({
        where: { id: verificationToken.userId },
        data: { verified: true }
    });

    await prismaClient.verificationToken.delete({
        where: { id: verificationToken.id }
    });

    return res.json({ message: "Email verified successfully" });
});

router.post("/signin", async (req, res) => {
    const body = req.body;
    const parsedData = SigninSchema.safeParse(body);

    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username,
        }
    });

    if (!user) {
        return res.status(403).json({
            message: "Sorry credentials are incorrect"
        })
    }

    const passwordMatch = await bcrypt.compare(parsedData.data.password, user.password);

    if (!passwordMatch) {
        return res.status(403).json({
            message: "Sorry credentials are incorrect"
        })
    }

    if (!user.verified) {
        return res.status(403).json({
            message: "Please verify your email first"
        })
    }



    // sign the jwt
    const token = jwt.sign({
        id: user.id
    }, JWT_PASSWORD);

    res.json({
        token: token,
    });
})

router.get("/", authMiddleware, async (req, res) => {
    // TODO: Fix the type
    // @ts-ignore
    const id = req.id;
    const user = await prismaClient.user.findFirst({
        where: {
            id
        },
        select: {
            name: true,
            email: true
        }
    });

    return res.json({
        user
    });
})

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await prismaClient.user.findFirst({ where: { email } });

    if (user) {
        const token = crypto.randomBytes(32).toString("hex");
        await prismaClient.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour
            }
        });

        await sendEmail(
            email,
            "Reset your password",
            `Reset your password here: ${process.env.FRONTEND_URL}/reset-password?token=${token}`
        );
    }

    return res.json({ message: "If an account exists with that email, we have sent a reset link." });
});

router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    const resetToken = await prismaClient.passwordResetToken.findFirst({
        where: { token }
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prismaClient.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword }
    });

    await prismaClient.passwordResetToken.delete({
        where: { id: resetToken.id }
    });

    return res.json({ message: "Password reset successfully" });
});

export const userRouter = router;