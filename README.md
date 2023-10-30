# Video streaming app

This is a video streaming website where you can dump your videos see your uploaded videos.
In this project you will find a prety good implementation of JS streams, transcoding big files, uses of ffmpeg etc.

## Requirements

In order to run this project follows 👇 these steps

1. Download the source file

> [!note]
> Make sure you have a **git & docker** preinstalled in your system.

```bash
git clone <url>
```
2. Go to the `video-streaming-app` directory

```bash
cd video-streaming-app
```
3. Build the frontend. by following this command

```bash
# move to frontend directory
cd frontend

# Install all the dependency
yarn install

# Build and move your frontend
yarn gulp

# return back to the parent folder
cd ..
```
This will add all the frontend changes into you `backend/static` directory.

4. Create your docker compose and run your app

```bash
docker compose up -d
```
> [!note]
> This will create a volume with name **backup-videos**, for backing up your processed videos you may backup this volume.

5. Now your website is up and running on the specified port mentioned into the `backend/Dockerfile` -> `EXPOSE`

6. You make access this site globally using the TCP tunneling tool **ngrok**

>   1. Downlaod **ngrok** in your system
>   2. Go to terminal and run the following command
>   ```bash
>   ngrok config add-authtoken <TOKEN> # you will get your TOKEN from ngrok website after creating an account
>   ```
>   3. RUN the following command to get an  https url of your website
>   ```bash
>   ngrok http <PORT> # here PORT should be same as the port your website is running.
>   ```

7. Have fun 🍻
