const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(cors());

cloudinary.config({
  cloud_name: "doi5p2oav",
  api_key: "822439516515541",
  api_secret: "tf98i-Ojv4orlUt-7XmdzTRQmIw"
});

app.get("/api/media", async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("folder:images")
      .sort_by("created_at", "desc")
      .max_results(50)
      .execute();

    res.json(result.resources);
  } catch {
    res.status(500).json({ error: "Failed to load media" });
  }
});

app.use(express.json());

app.post("/api/delete", async (req, res) => {
  try {
    const { publicId, resourceType } = req.body;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    if (result.result !== "ok" && result.result !== "not found") {
      return res.status(400).json({ error: "Delete failed" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.listen(3000, () =>
  console.log("Backend running on http://localhost:3000")
);
