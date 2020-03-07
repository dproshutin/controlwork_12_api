const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const pictures = require("./app/pictures");
const users = require("./app/users");
const config = require("./config");

const PORT = 8000;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

mongoose.connect(config.db.getDbPath(), {useNewUrlParser: true})
    .then(() => {
        app.use("/pictures", pictures());
        app.use("/users", users());
        console.log("Mongoose connected!");
        app.listen(PORT, () => {
            console.log(`Server started at ${PORT} port`);
        });
    });