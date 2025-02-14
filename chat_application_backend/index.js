const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/auth");
const Messages = require("./models/Messages");
const User = require("./models/User");

dotenv.config();

const app = express();
//create a http server
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

// Initializes a socket.io server instance
// http server instance created and attached to socket.io
// since socket.io needs http server instance for starting 
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//connect to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error(error));

app.use("/auth", authRoutes);

// socket io logic
//This event gets fire when a client(frontend) connects to the backend via Socket.IO.
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  //"send_message" event triggered from user(frontend)
  //and details like sender, receiver, message will
  //be saved in database
  socket.on("send_message", async (data) => {
    const { sender, receiver, message } = data;
    const newMessage = new Messages({ sender, receiver, message });
    await newMessage.save();

    //send message to all receivers or users
    socket.broadcast.emit("recive_message", data);
  });

  //connection disconnected when "disconnect" event triggered
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

//get all messages
app.get("/messages", async (req, res) => {
  const { sender, receiver } = req.query;
  try {
    //fetch the messages where sender and receiver matches req.query sender and receiver
    //or
    //sender matches req.query receiver and receiver matches req.query sender
    //sort on basis of createdAt
    const messages = await Messages.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages." });
  }
});

app.get("/users", async (req, res) => {
  const { currentUser } = req.query;
  try {
    //Fetches all users except the current user
    const users = await User.find({ username: { $ne: currentUser } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// app.listen => only http server gets started
// server.listen => both http and socket.io server started
// since socket.io needs http server instance for starting
// http server instance created and attahed to socket.io using const io = new Server(server, {...})

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
