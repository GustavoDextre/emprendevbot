'use strict'

const { PORT } = require('./config');
const { MainRoutes, WebhookRoutes } = require('./routers');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('port', PORT);
app.use(bodyParser.json());

app.get("/", MainRoutes);
app.use("/", WebhookRoutes)

app.listen(app.get('port'), function(req, res){
    console.log('El servidor de EmprenDev está funcionando en el puerto ', app.get('port'));
})