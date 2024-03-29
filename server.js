const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./config')
const jobModel = require('./model/jobs')

// mongodb
config.mongodb();

// NOTE Config Server
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cors())


// NOTE curl http://localhost:5012/xx/ok
app.get(`${config.PATH}/ok`, (req, res) => {
    res.send("ok")
})


app.post(`${config.PATH}/set`, async (req, res) => {
    await jobModel.deleteMany()
    await jobModel.insertMany([{
        json: req.body.jobs
    }])
    res.json({ status: true })
})


app.get(`${config.PATH}/get`, async (req, res) => {
    let a = await jobModel.find()
    res.json({ status: true, return: a[0] })
})


app.get(`${config.PATH}/all`, async (req, res) => {

    let temp = [];

    let a = await jobModel.find();
    a.map(i => temp.push(JSON.parse(i.json)));

    res.json({ status: true, return: temp });
})

process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
        console.error(err, 'Uncaught Exception thrown');
    });

// NOTE Deploy Server
app.listen(config.PORT, () => {
    console.log(`Server Running at ${config.PORT}`);
});
