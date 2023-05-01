const http = require("http");

http.createServer((req, res) => {
	res.write("On the way to beign a fs engineer!");
	res.end();
}).listen(3000);

console.log("server started on port 3000");
