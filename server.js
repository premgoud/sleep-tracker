const express = require("express");
const path = require("path");
const cors = require('cors'); 
const mongoose = require('mongoose'); 
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();
const session = require("express-session");
const passport = require("./config/passport")
const routes = require("./routes");


app.use(cors()); //mongodbAtlas
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const uri = process.env.ATLAS_URI || "mongodb://localhost/ztrakdev_db";
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true,  useUnifiedTopology: true  }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());


app.use("/api", routes)

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
