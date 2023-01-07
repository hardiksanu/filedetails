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

app.get('/download/:filename', async (req, res) => {
    let filename = req.params.filename;
    console.log("filename:", filename);
    const stream = fs.createReadStream(directory + "/" + filename);
    res.setHeader('Content-Type', 'application/bin');
    res.setHeader('Content-Disposition', `inline; filename= ${filename}`);
    stream.pipe(res);
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
    
    console.log("requested data:" , { ...req.body });
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
/*
app.post('/frequency', (req, res) => {
    freq_data = { ...req.body };
    console.log(freq_data, freq_data.freqData * 1);
    if (freq_data !== undefined) {
        exec('', (error, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            res.status(200).json(freqData.freqData * 1);
            return
        });
    };
});
app.post('/timer', (req, res) => {
    date_time = { ...req.body };
    if (date_time !== undefined) {
        exec('', (error, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            res.status(200).json(date_time);
            return
        });
    };
});
app.post('/start', (req, res) => {
    start_board = { ...req.body };
    console.log("Start Board:", start_board);
    if (start_board !== undefined) {
        // exec('', (error, stderr) => {
        //     if (error) {
        //         console.log(`error: ${error.message}`);
        //         return;
        //     }
        //     if (stderr) {
        //         console.log(`stderr: ${stderr}`);
        //         return;
        //     }
            res.status(200).json(start_board);
            return
        // });
    };
});*/
app.get('/stop/:stopButton', (req, res) => {
    let stop_board = req.params.stopButton;
    console.log("stop data received from web:", stop_board);
    if ((stop_board !== undefined)) {
        exec('dir', (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            // console.log(`stdout: ${stdout}`);
            console.log("stop data send to board:", stop_board);
            res.status(200).json(stop_board);
            console.log("stop data after send to board:", stop_board);
            return
        });
    };
});

module.exports = app;