import express from "express";
import { connectDB } from "./db.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Checkbox } from "./model.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const uri = process.env.MONGO_URI;
await connectDB(uri);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT ?? 3000;

let checkbox;

async function initCheckBox() {
  let checkbox = await Checkbox.findOne();

  if (!checkbox) {
    console.log("Creating bitset checkbox...");

    const total = 10000000;
    const bufferSize = Math.ceil(total / 8);

    checkbox = await Checkbox.create({
      states: Buffer.alloc(bufferSize),
    });
  }

  console.log("Initialized");
}

await initCheckBox();

io.on("connection", (socket) => {
  console.log("user connected");

  socket.emit("init-state", checkbox.states);

  socket.on("toggle-checkbox", async ({ index, checked }) => {
    try {
        checkbox.states[index] = checked;
        await checkbox.save();
    
        socket.broadcast.emit("update-checkbox", { index, checked });
    } catch (error) {
        console.error("Error updating checkbox:", error); 
    }
  });
});

// await Checkbox.deleteMany();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

console.log(await Checkbox.deleteMany())

server.listen(PORT, (req, res) => {
  console.log(`Server is listening on ${PORT}`);
});
