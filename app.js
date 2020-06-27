const express = require("express");

const configRoutes = require("./routes");
const static = express.static(__dirname + '/public');
const app = express();

app.use("/public", static);

var path = require('path');
global.appRoot = path.resolve(__dirname);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const csp = require('express-csp-header');
app.use(csp({
    policies: {
        'default-src': [csp.SELF, csp.INLINE, 'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-route.js'],
        'style-src': [csp.SELF, csp.INLINE, 'https://fonts.googleapis.com/'],
        'img-src': [csp.SELF],
        'font-src': [csp.SELF, 'https://fonts.gstatic.com/']
    }
}));

app.use('/', configRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("The application is running.");

    if (process && process.send) process.send({done: true});
});

module.exports = app;