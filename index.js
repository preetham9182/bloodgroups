const http = require('http');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');

async function main() {
    const uri = `mongodb+srv://bommapreetham9:lQEILIVHcesnZCaO@cluster0.tfhjc.mongodb.net/bloodgroup?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);
    try {
        await client.connect();
    } finally {
        await client.close();
    }
}

main().catch(console.error);

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (req.url === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });    
        const uri =`mongodb+srv://bommapreetham9:lQEILIVHcesnZCaO@cluster0.tfhjc.mongodb.net/bloodgroup?retryWrites=true&w=majority`;
        const client = new MongoClient(uri);
        try {
            await client.connect();
            let responseData = await getBloodGroupsInformation(client)
            res.end(JSON.stringify(responseData))
        } finally {
            await client.close();
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(" <h1> 404 Nothing Found </h1>")
    }
});

async function getBloodGroupsInformation(client) {
    const response = client.db("bloodgroup").collection("groups")
        .find();
    const results = await response.toArray();
    if (results.length > 0) {
        return results[0];
    }
}
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Our server is running on port: ${PORT}`));