
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const accommodationRoutes = require("./routes/accommodations");
const savedAccommodationRoutes = require("./routes/savedAccommodations");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const reservationRoutes = require("./routes/reservation");
const notificationRoutes = require("./routes/notifications");


connectDB();
const app = express();

//middleware
app.use(cors());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use("/api/user", userRoutes);
app.use("/api/accommodation", accommodationRoutes);
app.use("/api/savedAccommodation", savedAccommodationRoutes);
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)
app.use("/api/reservation", reservationRoutes)
app.use("/api/notification", notificationRoutes)


//listens for requests
const server = app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});



io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    //create a room for particular user
    if (userData !== null && userData.id !== null) {
      //create a room for particular user
      socket.join(userData.id);
      socket.emit("connected");
    } else {
      console.log("user is not logged in");
    }
  });

  //create a room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room " + room);
  });

  //socket for typing
  socket.on("typing", (room) => socket.in(room).emit("typing"));

  //socket for stop typing
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  //send a message
  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  //send a reservation notification
  socket.on("new reservation", (newReservationReceived) => {
    var reservation = newReservationReceived;

    if (!reservation.id) return console.log("Accommodation not defined");

    reservation.users.forEach((user) => {
      if(user._id === newReservationReceived.guest)
        return
    socket.in(user._id).emit("reservation received", newReservationReceived);
  })
  });

  //send a notification for accepted reservation
  socket.on("reservation accepted", (reservationAccepted) => {
    var reservation = reservationAccepted

    // if(!reservation.id) return console.log("Accommodation not defined");

    socket.in(reservationAccepted.guest).emit("reservation accepted", reservationAccepted)
    console.log("reservation has been accepted")
  })

    
  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData.id);
  });
});
