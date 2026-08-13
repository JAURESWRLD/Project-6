const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const router = require("./routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 8000;

app.use('/images', express.static(path.join(__dirname, '../images')));

// 2️⃣ Router API ensuite
app.use('/api', router);

app.listen(port, () => console.log(`Magic happens on port ${port}`));