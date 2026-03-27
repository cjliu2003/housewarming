# Photos

Drop guest photos in this folder (`public/photos/`) and reference them in `src/data.js`.

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

**In src/data.js, set the photo field like:**
```js
{ id: "kate", name: "Kate Cho", photo: "photos/kate.jpg" }
```

**Expected filenames:**
- `ephraim.jpg`
- `kate.jpg`
- `henry.jpg`
- `aadhya.jpg`
- `seveo.jpg`
- `kristin.jpg`
- `nathan.jpg`
- `matt.jpg`
- `jamiie.jpg`

**Tips:**
- Square crops look best (displayed in a 1:1 frame on the guests page, circle on reveal).
- ~500×500 px is plenty — no need for huge files.
- If a photo fails to load a silhouette placeholder appears automatically.
- Leave `photo: ""` to always use the placeholder.
