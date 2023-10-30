import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { transcodeVideo } from "./transCode.js";

// ENV variables initialisation goes here
dotenv.config()
const app = express();

// Some constants goes here
const port = process.env.PORT || 8000;
const baseUrl = `http://localhost:${port}`

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express config goes here
app.use(cors())
app.use(morgan('tiny'))
app.use("/thumbnails", express.static(path.join(__dirname, '../transcoded/thumbnails')))
app.use('', express.static(path.join(__dirname, './static')))

const upload = multer({
    dest: './transcoded'
})

// Url mappings goes here
app.post('/upload', upload.single('file1'), async (req, res) => {

    if (!req.file) {
        throw new Error('no file data')
    }

    transcodeVideo(req.file.originalname, req.file.path).then(()=> {
        res.status(200).send()
    },(err) => {
        console.error(err);
        res.status(500).send()
    })
});

app.get("/videos", (req, res) => {
    try {
        const transcodedFiles = fs.readdirSync('./transcoded');
        const videos = transcodedFiles.filter((filename) => {
            const parts = filename.split('.')
            return parts[parts.length - 1] === 'mp4'
        })
            .map((filename) => {
                return {
                    title: filename.replaceAll('.mp4',''),
                    url: `/video/${filename}`,
                    thumbnail: `/thumbnails/${filename}.png`
                }
            })

        res.json(videos)
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

app.get("/video/:videoName", (req, res) => {
    const range = req.headers.range;
    if( !range ) {
        res.status(400).send("Requires range header");
    }

    const videoPath = path.join(__dirname,`../transcoded/${req.params.videoName}`);

    const videoSize = fs.statSync(videoPath).size;

    const CHUNK_SIZE = 10 ** 6; // 1 MB

    console.log(`Range : ${range}`);
    
    const start = Number(range.replaceAll('bytes=','').split('-')[0]);

    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;

    const stats = new Stats(videoPath, videoSize, CHUNK_SIZE, start, end, contentLength);
    console.table([stats]);

    const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4'
    }

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });

    videoStream.pipe(res);
});

app.listen(port, () => {
    console.log(`App is listening on ${baseUrl}`);
});


function Stats(videoPath, videoSize, CHUNK_SIZE, start, end, contentLength) {
    this.videoPath = videoPath;
    this.videoSize = videoSize;
    this.CHUNK_SIZE = CHUNK_SIZE;
    this.start = start;
    this.end = end;
    this.contentLength = contentLength;
}