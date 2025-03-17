# YouTube Local
---

## Installation

### Clone this repository:
```bash
git clone https://github.com/DamirTesnjak/youtube-local.git
```

### Install a Docker hosting provider
Install any Docker hosting provider, such as [Docker](https://www.docker.com/) itself, if you do not have one installed already.

### Run the `install_app.sh` script
- **Windows:** Run the script using **[GIT for Windows](https://gitforwindows.org/)**.
- **Linux:** Grant execution permission to the script by running:
  ```bash
  chmod +x install_app.sh
  ```
  Then execute the command:
  ```bash
  ./run_docker.sh
  ```

---

## What happens during installation:
- If you are on **Linux**, the script will find your current **USER ID** and then execute the command:
  ```bash
  docker-compose up -d
  ```
  This sets up the necessary Docker containers.

- During setup, a new folder named `test` will be created:
    - **Linux:** `/home/<username>/test`
    - **Windows:** `C:\Users\<username>\test`

  This folder is where downloaded YouTube videos will be saved.
    - The app will have **read & write access** only to this folder and its subfolders.
    - By default, this folder does **not** contain any subfolders. You must create them manually using your operating system's file manager. Once created, they will be visible in the app.

- Inside the Docker container, the `test` folder will be seen as `/host`.

---

## After installation, check if the following containers are running:

| Container Name  | Description  |
|----------------|-------------|
| **nginx**      | Acts as a reverse proxy. |
| **videostreaming** | Handles video streaming to the client for playback in the browser. |
| **websocket**  | Receives real-time download progress updates from the backend and sends them to the client. |
| **YTLocal**    | Runs the Next.js app. |

---

## Usage

In your browser, enter:
```
localhost/
```
or
```
http://localhost:80
```
This points to the **nginx** container, which automatically redirects to the app.

> **Note:** YouTube's policy does not encourage downloading videos. This app was created for **educational purposes only**.

### How to use the app:
1. Enter a **YouTube URL** and specify a **video name** before saving.
2. Choose a directory where you want to save the video.
    - By default, videos are saved inside the `test` folder (as described in the **Installation** section).
3. Click the **Download** button to start downloading.
    - Please wait a few seconds. The app communicates with multiple containers before displaying the download progress.
4. Once the download is finished, a **video player** will appear, allowing you to play the video.
    - Alternatively, click **Open the video in a new tab** to play it in another tab.
5. You can **stop the download** at any time. However, keep in mind that the partially downloaded video will remain on your device up to the point where the download was interrupted.

---

## Caveats
- Sometimes, the **websocket** container may stop, causing unexpected app behavior.
    - To fix this, stop & restart all containers and re-run the app using:
      ```bash
      ./install_app.sh
      ```  
- This app will work **until** YouTube makes significant changes to its API.
- The app **always downloads videos in the highest available quality**, so expect **large data downloads**!

---
