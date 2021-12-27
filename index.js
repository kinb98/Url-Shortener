const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 3000;

const shortUrl = require("./models/url");

mongoose.connect("mongodb://localhost/shortenUrl", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("open", async () => {
  app.listen(PORT, () => {
    console.log("Server Started");
  });
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const allData = await shortUrl.find();
  res.render("index", { shortUrls: allData });
});

app.post("/short", async (req, res) => {
  const fullUrl = req.body.fullUrl;
  console.log("URL requested: ", fullUrl);

  const record = new shortUrl({
    full: fullUrl,
  });

  await record.save();
  res.redirect("/");
});

app.get("/:shortid", async (req, res) => {
  const shortId = req.params.shortid;

  const rec = await shortUrl.findOne({ short: shortId });

  if (!rec) return res.sendStatus(404);

  rec.clicks++;
  await rec.save();

  res.redirect(rec.full);
});
