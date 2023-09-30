var http = require("http");
var fetch = require("node-fetch");

var hostname = "localhost";
var port = process.env.PORT || 4243;
var PI_URL = process.env.PI_IP;

var server = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  if (request.method === "POST" && request.url === "/store/formatted") {
    var body = [];
    request
      .on("data", function(chunk) {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        postFormatted(JSON.stringify(JSON.parse(body)));
        response.end();
      });
  }
  if (request.method === "GET" && request.url === "/store/formatted") {
    getFormatted().then(data => {
      response.write(JSON.stringify(data));
      response.end();
    });
  }
  if (request.method === "GET" && request.url === "/store/everything") {
    getEverything().then(data => {
      response.write(JSON.stringify(data));
      response.end();
    });
  }
});

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

async function postFormatted(newObj) {
  try {
    await fetch(PI_URL + "/store/formatted", {
      method: "POST",
      body: newObj
    });
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function getFormatted() {
  let addresses;
  try {
    const response = await fetch(PI_URL + "/store/formatted");
    addresses = await response.text();
    addresses = JSON.parse(addresses);
    return addresses;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function getEverything() {
  let addresses;
  try {
    const response = await fetch(PI_URL + "/store/everything");
    addresses = await response.text();
    addresses = JSON.parse(addresses);
    return addresses;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}