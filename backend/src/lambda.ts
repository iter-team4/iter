import serverless from "serverless-http";
import app from "./app.js";
import { connectDB } from "./utils/db.js";

let initialized = false;

const initialize = async () => {
  if (!initialized) {
    await connectDB();
    initialized = true;
  }
};

export const handler = async (event: any, context: any) => {
  await initialize();

  return serverless(app)(event, context);
};