const mongoose = require("mongoose");
const shortid = require("shortid");

const UrlModel =mongoose.Schema({

  userid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
    short_id: {
        type: String,
        default: shortid.generate
      },
      originalUrl: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
})

module.exports = mongoose.model("url_model",UrlModel);