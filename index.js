//Here we build our node.js server in index.js and imported the app.js file with routes configured.

const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const {API_PORT} = process.env;

const port = process.env.PORT || API_PORT;

//SERVER LISTENING
server.listen(port, ()=> {
          console.log(`server running on port ${API_PORT}`);
});
