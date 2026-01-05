const CLOUD_NAME = "doi5p2oav";
const UPLOAD_PRESET = "images";
const API_URL = "https://media-uploader-9d24.onrender.com/api/media";
const DELETE_URL = "https://media-uploader-9d24.onrender.com/api/delete";

/* Load all media */
fetch(API_URL)
  .then(res => res.json())
  .then(renderGallery);

/* Upload */
function openWidget() {
  cloudinary.openUploadWidget(
    {
      cloudName: CLOUD_NAME,
      uploadPreset: UPLOAD_PRESET,
      multiple: true,
      resourceType: "auto",
      folder: "images"
    },
    (error, result) => {
      if (!error && result.event === "success") {
        addMedia(result.info, true);
      }
    }
  );
}

/* Render gallery */
function renderGallery(mediaList) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  mediaList.forEach(info => addMedia(info));
}

/* Add card */
function addMedia(info, prepend = false) {
  const gallery = document.getElementById("gallery");
  const url = info.secure_url;

  const media =
    info.resource_type === "video"
      ? `<video src="${url}" muted></video>`
      : `<img src="${url}" loading="lazy">`;

  const card = document.createElement("div");
  card.className = "col-xl-3 col-lg-4 col-md-6";

  card.innerHTML = `
    <div class="media-card">
      ${media}
      <div class="media-actions">
        <a href="${url}" target="_blank" class="btn btn-success">
          <i class="bi bi-download"></i>
        </a>
        <button class="btn btn-danger" onclick="deleteMedia('${info.public_id}', '${info.resource_type}', this)">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  `;

  prepend ? gallery.prepend(card) : gallery.appendChild(card);
}

/* Delete */
function deleteMedia(publicId, type, btn) {
  if (!confirm("Delete this media permanently?")) return;

  fetch(DELETE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId, resourceType: type })
  })
  .then(res => res.ok && btn.closest(".col-xl-3").remove());
}
