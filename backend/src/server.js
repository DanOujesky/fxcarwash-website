const express = require("express");

const app = express();

app.get("/hello", (req, res) => {
  res.status(201).json({ message: "hello world" });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
