const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;
const nanoid = require("nanoid");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (value) {
                if (!this.isModified('username')) return;
                const user = await User.findOne({username: value});
                if (user) throw new Error();
            },
            message: 'Sorry, the username is already in use...'
        }
    },
    password: {
        type: String,
        required: true
    },
    token: String,
    facebookId: String,
    displayName: {
        type: String,
        required: true
    },
    avatarImage: String
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
});

UserSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
    this.token = nanoid();
};

const User = mongoose.model("User", UserSchema);

module.exports = User;