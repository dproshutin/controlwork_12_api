const path = require("path");

const rootPath =__dirname;

module.exports = {
    rootPath,
    uploadsPath: path.join(rootPath, "/public/uploads"),
    db: {
        name: "gallery",
        url: "mongodb://localhost",
        getDbPath() {
            return this.url + "/" + this.name;
        }
    },
    fb: {
        appId: "200599967849500",
        secret: "e3f5eac9b36b0e809be024b20a4a4ebd"
    }
};