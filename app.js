require("dotenv").config();
//importing user context
const express = require("express");
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
app.use(cors({ origin: '*' }));

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
/*
app.get('/event' , (req, res) => {
          try{
                    // let count = 0;
                    res.writeHead(200, {
                              'Cache-Control': 'no-cache',
                              'Connection': "keep-alive",
                              'Content-Type': 'text/event-stream', 
                    });
                    setInterval(() => {
                              // count += 1;
                              // obj = {count};
                              // console.log(count);
                              const data = new Date().toLocaleString();
                              console.log(data);
                              // res.status(200).write(`data: ${JSON.stringify(obj)}\n\n`);
                              res.status(200).write(`data: ${data}\n\n`);
                    }, 5000);
          }
          catch (e) {
                    res.status(400).send(e);
          }
})
*/
app.get('/event', async (req, res) => {
          try {
                    let count = 0;
                    console.log("Client Connected");
                    res.writeHead(200, {
                              'Cache-Control': 'no-cache',
                              'Connection': "keep-alive",
                              'Content-Type': 'text/event-stream',
                    });
                    const intervalID = await setInterval(() => {
                              count += 1;
                              obj = { count };
                              console.log(count);
                              // const data = new Date().toLocaleString();
                              // console.log(data);
                              res.status(200).write(`data: ${JSON.stringify(obj)}\n\n`);
                              // res.status(200).write(`data: ${data}\n\n`);
                    }, 10000);

                    res.on('close', () => {
                              console.log("Client closed connection");
                              clearInterval(intervalID);
                    });
          }
          catch (e) {
                    res.status(400).send(e);
          };
});

app.get('/start', (req, res) => {
          try {
                    console.log(req.body);
                    res.status(200).send("Application started successfully.");
          }
          catch (e) {
                    res.status(400).send(e);

          }

});
app.get('/stop', (req, res) => {
          try {
                    console.log(req.body);
                    res.status(200).send("Application stopped successfully.");
          }
          catch (e) {
                    res.status(400).send(e);

          }

});

app.post('/create', (req, res) => {
          try {
                    console.log(req.body);
                    res.status(200).send(req.body);
          }
          catch (e) {
                    res.status(400).send(e);

          }
});
module.exports = app;