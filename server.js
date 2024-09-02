const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;



app.use(express.static(path.join(__dirname, "www")));

app.listen(PORT, () => {
  console.log(`Pumpkin - Server running on http://localhost:${PORT}`);
});
