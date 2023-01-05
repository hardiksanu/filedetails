
const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const API_PORT = 9090;
// const port = process.env.PORT || API_PORT;

//SERVER LISTENING
server.listen(API_PORT, ()=> {
          console.log(`server running on port ${API_PORT}`);
});
