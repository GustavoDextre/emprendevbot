if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

module.exports = {
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    TOKEN: process.env.TOKEN,
    PORT: process.env.PORT || 5000
};