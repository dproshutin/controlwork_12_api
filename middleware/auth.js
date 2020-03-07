const User = require("../models/User");

const auth = async function(req, res, next) {
    const token = req.get("Token");

    const user = await User.findOne({token});

    if (!user) {
        return res.status(401).send({error: "Invalid token"});
    }

    req.user = user;

    next();
};

module.exports = auth;