require("dotenv").config();
//importing user context
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
// const download = require('download');
const fs = require('fs');
const ls = require('ls');
const prettysize = require('prettysize');
const directory = path.join('C:/Users/Hardik/Desktop/Text_file/');
const cors = require('cors');

// to use json data in express app. through use of postman and get in this app, we needs to get permission from express app.
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

let event_res;
let event_data = undefined;
app.get('/file', (req, res) => {
          fs.readdir(directory, (err) => {
                    if (err) {
                              res.status(400).send('Unable to find directory: ' + err);
                    }
                    else {

                              const filedetailsindir = [];
                              for (let fileindir of ls(directory + "*")) {
                                        // console.log(`${fileindir.name} ${prettysize(fileindir.stat.size)}`); 
                                        // filedetailsindir.push({filename : fileindir , size: prettysize(fileindir.stat.size)});       
                                        filedetailsindir.push({ filename: fileindir.file, size: prettysize(fileindir.stat.size) });
                              }
                              return res.status(200).json(filedetailsindir);
                    }
          }
          );
});
app.delete('/delete', (req, res) => {
          try {
                    // console.log(req.body);
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

app.get('/download/:filename', (req, res) => {
          try {
                    let filename = req.params.filename;
                    console.log("filename:", filename);
                    res.download(directory + "/" + filename, (err) => {
                              if (err) {
                                        res.status(500).send({
                                                  message: "Unable to downlaod the file" + err,
                                        });
                              }
                              else {
                                        console.log("File download successfully");
                              }
                    });
          }
          catch (e) {
                    res.status(400).send(e);
          }
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
          const { Battery_Voltage, Frequency , Temperature , Odo_Count1, Odo_Count2, Odo_Count3 } = (req.body);
          console.log(req.body, event_res !== undefined);
          if (!( Battery_Voltage && Frequency && Temperature && Odo_Count1 && Odo_Count2 && Odo_Count3)) {
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
                    let { data } = req.body;
                    console.log('Body-data:', data);
                    res.status(200).send("Application started successfully.");
          }
          catch (e) {
                    res.status(400).send(e);

          }

});

app.post('/post/:freqData', (req, res) => {
          let value =  req.params.freqData;
          console.log("freqData: " , value);
})
module.exports = app;