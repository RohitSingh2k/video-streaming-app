import ffmpeg from "fluent-ffmpeg";

export const transcodeVideo = async (filename, filepath) => {
    return new Promise((resolve, reject) => {
            
            ffmpeg(filepath)
            .videoCodec('libx264')
            .audioCodec('libmp3lame')
            .size('720x?')
            .on('error', (err) => {
                reject(err);
            })
            .on('end', () => {
                ffmpeg(filepath)
                .screenshot({
                    timestamps : ['10%'],
                    folder: './transcoded/thumbnails',
                    filename: `${filename}.mp4.png`,
                    size: '720x?'
                })
                .on('error', (err) => {
                    reject(err);
                })
                .on('end', () => {
                    resolve();
                })
            })
            .save(`./transcoded/${filename}.mp4`)

        }
    );
};