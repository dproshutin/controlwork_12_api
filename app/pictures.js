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

    router.post("/", [auth, upload.single("image")], async (req, res) => {
        const pictureData = {
            title: req.body.title,
            image: req.file.filename,
            createdBy: req.user._id
        };

        const picture = new Picture(pictureData);
        try {
            res.send(await picture.save());
        } catch {
            res.sendStatus(400);
        }
    });

    router.delete('/', auth, async (req, res) => {
        try {
            const id = req.query.id;
            const picture = await Picture.findById(id);

            if (picture) {
                await picture.remove();
                const pictures = await Picture.find({createdBy: req.user._id});
                return res.status(200).send(pictures);
            } else {
                return res.status(400).send('Not found!');
            }

        } catch (error) {
            return res.status(400).send(error)
        }
    });
    
    return router;
};

module.exports = createRouter;