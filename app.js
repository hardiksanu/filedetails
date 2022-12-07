require("dotenv").config();
//importing user context
const express = require("express");
const app = express();
const path = require('path');
const download = require('download');
const fs = require('fs');
const ls = require('ls');
var prettysize = require('prettysize');
const directory = path.join('C:/Users/Hardik/Desktop/Text_file/');
const savepath = path.join('C:/Users/Hardik/Desktop/Save_file/');
var cors = require('cors');

// to use json data in express app. through use of postman and get in this app, we needs to get permission from express app.
app.use(express.json());
app.use(cors({ origin: '*' }));

app.get("/file1", (req, res) => {
          fs.readdir(directory, (err, files) => {
                    // console.log(files);
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    if (err) {
                              res.status(400).send('Unable to find directory: ' + err);
                    }
                    else {
                              res.status(200).json(files);
                    }

          });
});

app.get('/file', (req, res) => {
          fs.readdir(directory, (err) => {
                    if (err) {
                              res.status(400).send('Unable to find directory: ' + err);
                    }
                    else {

                              const filedetailsindir = [];
                              for (let fileindir of ls(directory + "*")) {
                                        // console.log(`${fileindir.name} ${prettysize(fileindir.stat.size)}`);
                                        //  return res.status(200).json([{file: file.name , size: file.stat.size}]);  
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
                    let { filename } = req.body
                    console.log("filename:", filename);
                    fs.unlink(directory + "*" + filename, (err) => {
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

app.get('/download', (req, res) => {
          try {
                    let { filename } = req.body;
                    console.log("filename:", filename);
                    console.log(filename);
                    console.log(savepath);
                    console.log(directory);
                    const finaldata = `${directory + "*" + filename}/savepath + "*" + filename}`;
                    // res.download(directory + "*" + filename, savepath + "*" + filename)
                    res.download(finaldata)
                    .then(() => {
                              console.log("File download successfully");
                    }); // Set disposition and send it.
                    // res.download(directory + filename, savepath)
                              // .then(() => {
                                        // res.status(200).send("File download successfully");
                                        // console.log("File download successfully");
                              // });
          }
          catch (e) {
                    res.status(400).send(e);
          }
});


module.exports = app;