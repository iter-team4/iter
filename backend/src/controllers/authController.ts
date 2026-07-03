import type { Request, Response } from "express";
import {
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { cognito } from "../utils/cognito.js";
import User from "../models/User.js";

export const register = async (req: Request, res: Response) => {
  const { email, password, name, username } = req.body;

  if (!email || !password || !name || !username) {
    return res.status(400).json({
      message: "Missing fields",
    });
  }

  try {
    await cognito.send(
      new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID!,
        Username: email,
        Password: password,
        UserAttributes: [
          {
            Name: "email",
            Value: email,
          },
        ],
      }),
    );

    return res.status(201).json({
      message: "Verification code sent.",
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: "Registration failed.",
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, code, name, username } = req.body;

  if (!email || !code || !name || !username) {
    return res.status(400).json({
      message: "Missing fields",
    });
  }

  try {
    await cognito.send(
      new ConfirmSignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID!,
        Username: email,
        ConfirmationCode: code,
      }),
    );

    const existing = await User.findOne({ email });
    console.log("Existing user:", existing);

    if (!existing) {
      const user = await User.create({
        cognitoSub: email,
        email,
        name,
        username,
      });

      console.log("Created user:", user);
    }

    return res.status(200).json({
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: "Invalid or expired code.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Missing fields",
    });
  }

  try {
    const result = await cognito.send(
      new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.COGNITO_CLIENT_ID!,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      }),
    );

    const authResult = result.AuthenticationResult;

    return res.status(200).json({
      message: "Login successful",
      accessToken: authResult?.AccessToken,
      idToken: authResult?.IdToken,
      refreshToken: authResult?.RefreshToken,
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Invalid credentials or user not confirmed",
    });
  }
};
