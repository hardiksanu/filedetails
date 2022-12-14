require("dotenv").config();
//importing user context
const express = require("express");
const app = express();
const path = require('path');
// const download = require('download');
const fs = require('fs');
const ls = require('ls');
var prettysize = require('prettysize');
const directory = path.join('C:/Users/Hardik/Desktop/Text_file/');
// const savepath = path.join('./download');
var cors = require('cors');

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

app.get('/event' , (req, res) => {
          try{
                    let count = 0;
                    res.writeHead(200, {
                              'Cache-Control': 'no-cache',
                              'Connection': "keep-alive",
                              'Content-Type': 'text/event-stream', 
                    });
                    setInterval(() => {
                              count += 1;
                              obj = {count};
                              console.log(count);
                              res.status(200).write(`data: ${JSON.stringify(obj)}\n\n`);
                              // res.write(` ${JSON.stringify(obj)}\n\n`);
                    }, 5000);
          }
          catch (e) {
                    res.status(400).send(e);
          }
})

module.exports = app;