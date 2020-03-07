const router = require("express").Router();
const User = require("../models/User");
const config = require("../config");
const multer = require("multer");
const nanoid = require("nanoid");
const path = require("path");
const axios = require("axios");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadsPath);
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, nanoid() + path.extname(file.originalname))
    }
});

const upload = multer({storage: storage});

const createRouter = () => {
    router.post("/", upload.single("avatarImage"), async (req, res) => {
        let userData = {
            username: req.body.username,
            password: req.body.password,
            displayName: req.body.displayName,
        };
        if (req.file) {
            userData.avatarImage = req.file.filename;
        }
        if (req.body.role) {
            userData.role = req.body.role;
        }

        const user = new User(userData);
        user.generateToken();
        try {
            res.send(await user.save());
        } catch(e) {
            return res.status(400).send(e);
        }
    });

    router.post("/sessions", async (req, res) => {
        const user = await User.findOne({username: req.body.username});
        if (!user) {
            return res.status(400).send({error: "Username not found"});
        }

        const isMatch = await user.checkPassword(req.body.password);

        if (!isMatch) {
            return res.status(400).send({error: "Wrong password"});
        }

        user.generateToken();

        await user.save();

        res.send(user);
    });

    router.delete("/sessions", async (req, res) => {
        const token = req.get("Token");
        const success = {message: "Success"};

        if (!token) return res.send(success);

        const user = await User.findOne({token});

        if (!user) return res.send(success);

        user.generateToken();
        await user.save();
        res.send(success);
    });

    router.post("/facebookLogin", async (req, res) => {
        const inputToken = req.body.accessToken;
        const accessToken = config.fb.appId + "|" + config.fb.secret;

        const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=${accessToken}`;

        try {
            const response = await axios.get(debugTokenUrl);
            const responseData = response.data;

            if (responseData.data.error) {
                return res.status(401).send({message: "Facebook token incorrect"});
            }

            if (req.body.id !== responseData.data.user_id) {
                return res.status(401).send({message: "Wrong user id"});
            }

            let user = await User.findOne({facebookId: req.body.id});

            if (!user) {
                user = new User({
                    username: req.body.email || req.body.id,
                    password: nanoid(),
                    facebookId: req.body.id,
                    displayName: req.body.name,
                    avatarImage: req.body.picture.data.url
                });
            }

            user.generateToken();
            await user.save();

            return res.send(user);
        } catch (e) {
            return res.status(401).send({message: e.message});
        }

    });

    return router;
};

module.exports = createRouter;