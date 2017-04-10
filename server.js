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

    let request = http.request(options);
    request.write(JSON.stringify(lastname));
    request.on('response', (res) => {
      let answ = '';
      res.on('data', (chunk) => answ += chunk);
      res.on('end', () => {
        console.log(answ);
      });
    });


    request.end();


  });

  res.end();
}

function parse(data, contentType) {
  console.log(contentType);
  if (contentType == 'application/json') {
    return JSON.parse(data);
  }
  //
  if (contentType == 'application/x-www-form-urlencoded') {
    return queryString.parse(data);
  }
}

const server = http.createServer();
server.on('error', err => console.error(err));
server.on('request', proccess);

server.listen(port);
