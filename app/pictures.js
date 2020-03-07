const express = require("express");
const router = express.Router();
const nanoid = require("nanoid");
const multer = require("multer");
const path = require("path");
const config = require("../config");
const Picture = require("../models/Picture");
const auth = require("../middleware/auth");

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
    router.get("/", async (req, res) => {
        try {
            let pictures = await Picture.find().populate('createdBy');
            if (pictures.length > 0) {
                if (req.query.user) {
                    pictures = pictures.filter(item => item.createdBy._id.toString() === req.query.user);
                }
            }
            res.send(pictures);
        } catch {
            res.sendStatus(500);
        }
    });

    router.get('/:id', async (req, res) => {
        const criteria = {_id: req.params.id};
        await Picture.findOne(criteria).then(picture => {
            if (picture) res.send(picture);
            else res.sendStatus(404);
        }).catch(() => res.sendStatus(500));
    });

    return router;
};

module.exports = createRouter;