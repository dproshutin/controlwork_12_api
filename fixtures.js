const mongoose = require("mongoose");
const config = require("./config.js");

const Picture = require("./models/Picture");
const User = require("./models/User");

mongoose.connect(config.db.getDbPath());

const db = mongoose.connection;

db.once("open", async () => {
    try {
        await db.dropCollection("users");
        await db.dropCollection("pictures");
    } catch (e) {
        console.log("Collections were not present, skipping drop...");
    }

    const [user1, user2, user3, user4] = await User.create({
        username: "mkopbayeva",
        password: "123",
        token: "zCyG6814-OUXPBWdGyi4W",
        displayName: "Meruert Kopbayeva",
        avatarImage: "Kopbayeva.jpeg"
    }, {
        username: "vivanov",
        password: "123",
        token: "OpddkkiYNir0Cf2QBvBNm",
        displayName: "Vladimir Ivanov",
        avatarImage: "Ivanov.jpeg"
    }, {
        username: "aiskakov",
        password: "123",
        token: "IeumB-lAP86dH-ddwD3eD",
        displayName: "Anuar Iskakov",
        avatarImage: "Iskakov.jpeg"
    }, {
        username: "pkobylko",
        password: "123",
        token: "OpddkkiYNir0Cf2QBvBN1",
        displayName: "Pavel Kobylko",
        avatarImage: "Kobylko.jpeg"
    });
    await Picture.create({
        title: "Red Flowers",
        image: "flowers.jpeg",
        createdBy: user1._id
    }, {
        title: "Водопады между высокими деревьями",
        image: "waterfalls.jpeg",
        createdBy: user2._id
    }, {
        title: "Озеро с деревьями",
        image: "lake.jpeg",
        createdBy: user3._id
    }, {
        title: "Зелёная трава в лесу",
        image: "forest.jpeg",
        createdBy: user4._id
    }, {
        title: "Гора на рассвете",
        image: "mountain.jpeg",
        createdBy: user1._id
    }, {
        title: "Дорога, ведущая сквозь горы",
        image: "road.jpeg",
        createdBy: user2._id
    }, {
        title: "Красный кардинал на ветке",
        image: "bird.jpeg",
        createdBy: user3._id
    }, {
        title: "Подсолнухи под голубым небом",
        image: "sky.jpeg",
        createdBy: user4._id
    }, {
        title: "Скалистый берег",
        image: "shore.jpeg",
        createdBy: user1._id
    }, {
        title: "Бредущий в пустыне странник",
        image: "desert.jpeg",
        createdBy: user2._id
    }, {
        title: "Скалистый полуостров",
        image: "peninsula.jpeg",
        createdBy: user3._id
    }, {
        title: "Мостовая, укрытая осенними красными листьями",
        image: "pave.jpeg",
        createdBy: user4._id
    });
    db.close();
});