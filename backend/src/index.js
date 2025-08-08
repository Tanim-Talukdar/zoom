import express from "express";
import { createServer } from "node:http";



import mongoose from "mongoose";
import { connectToSocket } from "./controller/socketManager.js";

import cors from "cors";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server)

app.set("port" ,(process.env.PORT || 8000));
app.use(cors());
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({limit: "40kb", extended: true}));

app.use("/api/v1/users", userRoutes);



const start = async () => {
    const conDb = await mongoose.connect("mongodb+srv://TanimTalukdar:3Rf4ZMcjukPuKeuP@cluster0.w6p8g.mongodb.net/Zoom?retryWrites=true&w=majority&appName=Cluster0"); 
    server.listen(app.get("port"), () => {
        console.log(`Server is running on http://localhost:${app.get("port")}/api/v1/users`);
    })
};

start();