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
let event_data = undefined;
let freq_data = undefined;

app.get('/file', (req, res) => {
          fs.readdir(directory, (err) => {
                    if (err) {
                              res.status(400).send('Unable to find directory: ' + err);
                    }
                    else {

                              const filedetailsindir = [];
                              for (let fileindir of ls(directory + "*")) {
                                        filedetailsindir.push({ filename: fileindir.file, size: prettysize(fileindir.stat.size) });
                                        // console.log(filedetailsindir);
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
                    fs.unlink(d


                              , (err) => {
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
                    console.log(event_data);
                    event_res.status(200).write(`data: ${JSON.stringify(event_data)}\n\n`);
                    // console.log(event_res);
                    res.status(200).send();
          }


});
app.post('/start', (req, res) => {
           let start_board = { ...req.body };
                    console.log('Body-data:', start_board.key);
                    // if (!(start_data)){
                    //           res.status(400).send("Board is already started");
                    // }
                    res.status(200).send("Application started successfully.");    
});

app.post('/stop', (req, res) => {
                    let stop_data = { ...req.body };
                    console.log('Body-data:', stop_data.key);
                    res.status(200).send("Please stop the application.");

});

app.get('/freq', (req, res) => {
          try {
                    console.log("Connected for send the freq");
                    // console.log(freq_data);
                    // console.log(freq_data.freqData);
                    res.status(200).json(freq_data.freqData * 1);

                    res.on('close', () => {
                              console.log("Connection closed after send the freq.");
                    })
          }
          catch (e) {
                    res.status(400).send(e);
          };
});
app.post('/frequency', (req, res) => {
          freq_data = { ...req.body };
          // console.log(freq_data, freq_data.freqData * 1);
          if (freq_data !== undefined){
          res.status(200).write(`${JSON.stringify(freq_data)}\n\n`);
          res.status(200).send();
          }
});


module.exports = app;