require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require('fs');
const ls = require('ls');
const prettysize = require('prettysize');
const directory = path.join('C:/Users/Hardik/Desktop/Text_file/');
const cors = require('cors');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

let event_res;
let frequency_data, frequency_res;
let event_data = undefined;
app.get('/file', (req, res) => {
          fs.readdir(directory, (err) => {
                    if (err) {
                              res.status(400).send('Unable to find directory: ' + err);
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
                    console.log("filename:", filename);
                    fs.unlink(directory + "/" + filename, (err) => {
                              if (err) {
                                        res.status(200).send(err);
                              }
                              else {
                                        res.status(200).send("File deleted successfully.");
                              }
                    });
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
                    console.log("Client Connected");
                    res.writeHead(200, {
                              'Cache-Control': 'no-cache',
                              'Connection': "keep-alive",
                              'Content-Type': 'text/event-stream',
                    });
                    console.log(event_data);
                    res.status(200).write(`data: ${JSON.stringify(event_data)}\n\n`);

                    res.on('close', () => {
                              console.log("Client has closed the connection");
                              event_res = undefined;
                    });
          }
          catch (e) {
                    res.status(400).send(e);
          };
});

app.post('/create', (req, res) => {
          const { Battery_Voltage, Frequency, Temperature, Odo_Count1, Odo_Count2, Odo_Count3 } = (req.body);
          console.log(req.body, event_res !== undefined);
          if (!(Battery_Voltage && Frequency && Temperature && Odo_Count1 && Odo_Count2 && Odo_Count3)) {
                    res.status(400).send("All data is required.");
          }
          else if (event_res !== undefined) {
                    console.log("Client connected so sending data")
                    event_data = { ...req.body }
                    event_res.status(200).write(`data: ${JSON.stringify(event_data)}\n\n`);
                    res.status(200).send();
          }


});
app.get('/start', (req, res) => {
          try {
                    let { request_data } = req.body;
                    console.log('Body-data:', request_data);
                    res.status(200).send("Application started successfully.");
          }
          catch (e) {
                    res.status(400).send(e);

          }

});

app.get('/stop', (req, res) => {
          try {
                    let { body_data } = req.body;
                    console.log('Body-data:', body_data);
                    res.status(200).send("Please stop the application.");
          }
          catch (e) {
                    res.status(400).send(e);

          }

});

app.post('/frequency', (req, res) => {
          frequency_data = { ...req.body };
          console.log(frequency_data);
          res.status(200).write(`${JSON.stringify(frequency_data.freqData)}\n\n`);
          res.status(200).send();

});

module.exports = app;