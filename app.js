require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require('fs');
const ls = require('ls');
const prettysize = require('prettysize');
const { exec } = require("child_process");
const directory = path.join('/', 'media', 'nvme1', "/");

const cors = require('cors');
const { dir } = require("console");
app.use(express.static(path.join(__dirname, 'build')))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

let event_res;
let event_data = undefined;
let freq_data = undefined;
let date_time, datasendtoweb;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.get('/file', (req, res) => {
    fs.readdir(directory, (err) => {
        if (err) {
            return res.status(400).send('Unable to find directory: ' + err);
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
                return res.status(200).send(err);
            }
            else {
                return res.status(200).send("File deleted successfully.");
            }
        });
    }
    catch (e) {
        res.status(400).send(e);
    }
});

app.get('/download/:filename', async (req, res) => {
    let filename = req.params.filename;
    const stream = fs.createReadStream(directory + "/" + filename);
    res.setHeader('Content-Type', 'application/bin');
    res.setHeader('Content-Disposition', `inline; filename= ${filename}`);
    stream.pipe(res);
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
        res.writeHead(200, {
            'Cache-Control': 'no-cache',
            'Connection': "keep-alive",
            'Content-Type': 'text/event-stream',
        });
        fs.readFile('/root/OSLBackend/start.json', (err, datainfile) => {
            if (err) {
                return console.log("Error while read file:", err);
            }
            try {
                datasendtoweb = JSON.parse(datainfile);
                return res.status(200).write(`data: ${JSON.stringify(datasendtoweb)}\n\n`);
            }
            catch (err) {
                console.log("Error parsing JSON string:", err);
            }
        });
        res.on('close', () => {
            event_res = undefined;
        });
    }
    catch (e) {
        res.status(400).send(e);
    };
});

app.post('/create', (req, res) => {
    const { Battery_Voltage, Frequency, Temperature, Odo_Count1, Odo_Count2, Odo_Count3, Set_Frequency } = (req.body);
    if (!(Battery_Voltage && Frequency && Temperature && Odo_Count1 && Odo_Count2 && Odo_Count3 && Set_Frequency)) {
        return res.status(400).send("All data is required.");
    }
    else if (event_res !== undefined) {
        event_data = { ...req.body };
        event_res.status(200).write(`data: ${JSON.stringify(event_data)}\n\n`);
        fs.writeFile('/root/OSLBackend/start.json', JSON.stringify(event_data), (error) => {
            if (error) throw error;
            
        });
        return res.status(200).send();
    }
    return res.status(200).send();
});

app.get('/start', (req, res) => {
    if (fs.existsSync('/root/OSLBackend/stop.txt')) {
        fs.unlink('/root/OSLBackend/stop.txt', () => {
        });
    }
    if (fs.existsSync('/root/OSLBackend/start.txt')) {
        res.status(200).send('Board is already start, please click on stop button to stop the board');
    }
    else {
        let a = exec('/usr/bin/getstartclick');
        fs.writeFile('/root/OSLBackend/start.txt', 'start', (error) => {
            if (error) throw error;
        })
        res.status(200).send();
    };
});
app.get('/stop', (req, res) => {
    if (fs.existsSync('/root/OSLBackend/start.txt')) {
        fs.unlink('/root/OSLBackend/start.txt', () => {
        });
    }

    if (fs.existsSync('/root/OSLBackend/stop.txt')) {
        res.status(200).send('Board is already stop, please click on start button to start the board');
    }
    else {
        let a = exec('/usr/bin/getstopclick');
        fs.writeFile('/root/OSLBackend/stop.txt', 'Stop', (error) => {
            if (error) throw error;
        });
        res.status(200).send();
    };
});

app.get('/frequency/:freqData', (req, res) => {
    freq_data = req.params.freqData;
    if (freq_data !== undefined) {
        exec(`/usr/bin/getfrequency ${freq_data}`, (error, stdout, stderr) => {
            if (error) {
                return console.log(`error: ${error.message}`);
            }
            if (stderr) {
                return console.log(`stderr: ${stderr}`);
            }
            return res.status(200).send(freq_data);
        });
    };
});

app.get('/timer/:dateTime', (req, res) => {
    date_time = req.params.dateTime;
    if (date_time !== undefined) {
        exec(`/usr/bin/gettime ${date_time}`, (error, stdout, stderr) => {
            if (error) {
                return console.log(`error: ${error.message}`);
            }
            if (stderr) {
                return console.log(`stderr: ${stderr}`);
            }
            return res.status(200).send(`${JSON.stringify(date_time)}`);
        });
    };
});

module.exports = app;