require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require('fs');
const ls = require('ls');
const prettysize = require('prettysize');
const { exec } = require("child_process");
// const directory = path.join('C:/Users/Hardik/Desktop/Text_file/');
const directory = path.join('C:', 'Users', 'Hardik', 'Desktop', 'Text_file', "/");

const cors = require('cors');
const { dir } = require("console");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

let event_res;
let event_data = undefined;
let freq_data = undefined;
let freqData;
let date_time;

app.get('/file', (req, res) => {
    fs.readdir(directory, (err) => {
        if (err) {
            res.status(400).send('Unable to find directory: ' + err);
            return;
        }
        else {

            const filedetailsindir = [];
            for (let fileindir of ls(directory + "*")) {     
                filedetailsindir.push({ filename: fileindir.file, size: prettysize(fileindir.stat.size) });
            }
            return res.status(200).json(filedetailsindir);
        }
    }
    );
});
app.delete('/delete', (req, res) => {
    try {
        let { filename } = req.body;
        fs.unlink(directory + "/" + filename, (err) => {
            if (err) {
                res.status(200).send(err);
                return;
            }
            else {
                res.status(200).send("File deleted successfully.");
                return;
            }
        });
    }
    catch (e) {
        res.status(400).send(e);
    }
});

app.get('/deleteall', (req, res) => {
    try {
        for (let fileindir of ls(path.join(directory, "*"))) {
            fname = path.join(fileindir.path, fileindir.file);
            fs.unlink(fname, () => {
            });
        }
        return res.status(200).send("All files deleted successfully");
    }
    catch (e) {
        res.status(400).send(e);
    }
});

app.get('/event', (req, res) => {
    event_res = res;
    try {
        // console.log("Client Connected");
        res.writeHead(200, {
            'Cache-Control': 'no-cache',
            'Connection': "keep-alive",
            'Content-Type': 'text/event-stream',
        });
        res.status(200).write(`data: ${JSON.stringify(event_data)}\n\n`);

        res.on('close', () => {
            // console.log("Client has closed the connection");
            event_res = undefined;
        });
    }
    catch (e) {
        res.status(400).send(e);
    };
});
app.post('/create', (req, res) => {
    const { Battery_Voltage, Frequency, Temperature, Odo_Count1, Odo_Count2, Odo_Count3 } = (req.body);
    if (!(Battery_Voltage && Frequency && Temperature && Odo_Count1 && Odo_Count2 && Odo_Count3)) {
        res.status(400).send("All data is required.");
        return
    }
    else if (event_res !== undefined) {
        // console.log("Client connected so sending data");
        event_data = { ...req.body };
        event_res.status(200).write(`data: ${JSON.stringify(event_data)}\n\n`);
        res.status(200).send();
        return
    }
    res.status(200).send();
});
app.post('/start', (req, res) => {
    start_board = { ...req.body };
    // console.log('Body-data:', start_board.key);
    if ((start_board !== undefined)) {
              res.status(200).write(`${JSON.stringify(start_board)}\n\n`);
              res.status(200).send();
    }
});

app.get('/startboard', (req, res) => {
    try {
              res.status(200).json(start_board.key * 1);
              res.on('close', () => {
                        // console.log("Connection closed after send the message");
                        start_board.key = 2;
              });
    }
    catch (e) {
              res.status(400).send(e);
    };
});
app.post('/stop', (req, res) => {
    stop_board = { ...req.body };
    // console.log('Body-data:', stop_board.key);
    if ((stop_board !== undefined)) {
              res.status(200).write(`${JSON.stringify(stop_board)}\n\n`);
              res.status(200).send();
    }
});
app.get('/stopboard', (req, res) => {
    try {
              res.status(200).json(stop_board.key * 1);
              res.on('close', () => {
                        // console.log("Connection close after stop the board");
                        stop_board.key = 2;
              });
    }
    catch (e) {
              res.status(400).send(e);
    }
});
app.get('/freq', (req, res) => {
    try {
              res.status(200).json(freq_data.freqData * 1);
              res.status(200).send();
              return
    }
    catch (e) {
              res.status(400).send(e);
    };
});
app.post('/frequency', (req, res) => {
    freq_data = { ...req.body };
    if (freq_data !== undefined) {
              res.status(200).write(`${JSON.stringify(freq_data)}\n\n`);
              res.status(200).send();
    }
});

app.post('/timer', (req, res) => {
    date_time = { ...req.body };
    if(date_time !== undefined) {
              res.status(200).write(`${JSON.stringify(date_time)}\n\n`);
              res.status(200).send();
    }   
});
app.get('/datetime', (req, res) => {
    if(date_time == undefined) {
        date_time = 0;
        res.status(200).write(`${JSON.stringify(date_time)}\n\n`);
        res.status(200).send();
        date_time = undefined;
        return
    }
    else{
    res.status(200).json(date_time.dateTime);
    res.status(200).send();
    date_time = undefined;
    }
});

module.exports = app;