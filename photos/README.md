# Photos

Drop guest photos in this folder and reference them in `data.js`.

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

**In data.js, set the photo field like:**
```js
{ id: "alice", name: "Alice Johnson", photo: "photos/alice.jpg" }
```

**Tips:**
- Square crops look best (the site displays them in a square frame).
- ~500×500 px is plenty — no need for huge files.
- If a photo can't load (wrong filename, etc.) a silhouette placeholder appears automatically.
- Leave `photo: ""` to always show the placeholder instead.
