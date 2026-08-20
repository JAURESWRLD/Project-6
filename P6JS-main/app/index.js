const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const router = require("./routes");

const app = express();
const frontendUrl = process.env.FRONTEND_URL;

app.use(cors({ origin: frontendUrl, credentials: false }));
app.use(bodyParser.json({ limit: "100kb" }));
const port = 8000;

app.use('/images', express.static(path.join(__dirname, '../images')));

// 2️⃣ Router API ensuite
app.use('/api', router);

app.listen(port, () => console.log(`Magic happens on port ${port}`));