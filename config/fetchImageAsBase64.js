import axios from "axios";

export default async function fetchImageAsBase64(url) {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    const base64 = Buffer.from(res.data).toString("base64");

    // detect image type automatically
    let ext = url.split(".").pop().toLowerCase();
    let mime = ext === "png" ? "image/png" : "image/jpeg";

    return { base64, mime };
}
