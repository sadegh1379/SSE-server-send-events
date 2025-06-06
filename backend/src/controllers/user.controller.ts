import { Request, Response } from "express";
import User from "../models/user.model";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUsersStream = async (req: Request, res: Response) => {
  const getUserFromProviderA = () =>
    new Promise((res) => setTimeout(() => res({ id: 1, name: "Ali" }), 5000));
  const getUserFromProviderB = () =>
    new Promise((res) => setTimeout(() => res({ id: 2, name: "Sara" }), 7000));
  const getUserFromProviderC = () =>
    new Promise((res) => setTimeout(() => res({ id: 3, name: "Reza" }), 1000));
  try {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const providers = [
      getUserFromProviderA,
      getUserFromProviderB,
      getUserFromProviderC,
    ];

    providers.forEach(async (getUser) => {
      try {
        const user = await getUser();
        res.write(`data: ${JSON.stringify(user)}\n\n`);
      } catch (err) {
        res.write(
          `event: error\ndata: ${JSON.stringify({ error: err as string })}\n\n`
        );
      }
    });

    Promise.all(providers.map((p) => p()))
      .then(() => {
        res.write(`event: end\ndata: done\n\n`);
        res.end();
      })
      .catch(() => {
        res.end();
      });

    req.on("close", () => {
      console.log("Client disconnected");
      res.end();
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: "Failed to create user" });
  }
};
