const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const secreatCodeScheme = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        dateCreated: {
            type: Date,
            default: Date.now(),
            expires: 600,
        },
    }
)


 
module.exports =mongoose.model("SecreatCode",secreatCodeScheme);