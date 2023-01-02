
const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const port = process.env.PORT || API_PORT;

//SERVER LISTENING
server.listen(port, ()=> {
          console.log(`server running on port ${port}`);
});
