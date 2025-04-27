const http = require("http");
const axios = require("axios");
require("dotenv").config();

const BASE_API_URL =
    "https://chromeuxreport.googleapis.com/v1/records:queryRecord";
const PORT = process.env.PORT || 5000;
const API_CRED_KEY = process.env.API_CRED_KEY;

const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === "/api/crux" && req.method === "POST") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", async () => {
            try {
                const { urls } = JSON.parse(body);

                if (!urls || !Array.isArray(urls)) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(
                        JSON.stringify({
                            error: "Invalid request. Expecting array of URLs.",
                        })
                    );
                    return;
                }

                const responsePromises = urls.map((url) =>
                    axios.post(
                        `${BASE_API_URL}?key=${API_CRED_KEY}`,
                        { origin: url },
                        { headers: { "Content-Type": "application/json" } }
                    )
                    
                );

                const URLResponses = await Promise.all(responsePromises);

                const data = URLResponses.map((response, index) => ({
                    url: urls[index],
                    record: response.data.record,
                }));

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ data }));
            } catch (error) {
                console.error("Error:", error.message);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Failed to fetch the API Data." }));
            }
        });
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
