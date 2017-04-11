const http = require('http');
const queryString = require('querystring');
const port = 3000;

function proccess(req, res) {
  let data = '';

  req.on('data', chunk => {
    data += chunk;
  });

  req.on('end', () => {
    let pdata = parse(data, req.headers['content-type']);

    let lastname = {
      'lastName': pdata.lastname
    }

    let options = {
      hostname: 'netology.tomilomark.ru',
      path: '/api/v1/hash',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Firstname': pdata.firstname
      }
    };

    let answ = '';
    let answer = '';
    let request = http.request(options);
    request.write(JSON.stringify(lastname));
    request.on('response', (result) => {
      result.on('data', (chunk) => answ += chunk);
      result.on('end', () => {
        answ = JSON.parse(answ);
        answer = {
          'firstName': pdata.firstname,
          'lastName': pdata.lastname,
          'secretKey': answ.hash
        }

        res.writeHead(200, 'OK', {'Content-Type': 'application/json'});
        res.write(JSON.stringify(answer));
        console.log('Answer is ready');
        res.end();
      });
    });

    request.end();

  });


}

function parse(data, contentType) {
  if (contentType == 'application/json') {
    return JSON.parse(data);
  }

  if (contentType == 'application/x-www-form-urlencoded') {
    return queryString.parse(data);
  }
}

const server = http.createServer();
server.on('error', err => console.error(err));
server.on('request', proccess);
server.on('listening', () => {
  console.log('Start HTTP on port %d', port);
});

server.listen(port);
