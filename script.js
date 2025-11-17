const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas(){
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
}

resizeCanvas();

let drawing = false;

function getPos(e) {
    const rect = canvas.getBoundingClientRect();

    if (e.touches) {
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        };
    } else {
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
}

function startDraw(e) {
    drawing = true;
    ctx.beginPath();

    const pos = getPos(e);
    ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
    if (!drawing) return;

    const pos = getPos(e);

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function endDraw() {
    drawing = false;
}

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mouseleave", endDraw);

canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", endDraw);

document.getElementById("clearBtn").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById("savePngBtn").addEventListener("click", () =>{
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'signature.png';
    link.click();
})

document.getElementById("saveJpgBtn").addEventListener("click", () =>{
    const tempCanvas = document.createElement('canvas');
    tempCanvas.height = canvas.height;
    tempCanvas.width = canvas.width;

    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.fillStyle = "#fff";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.drawImage(canvas, 0, 0);

    const dataURL = tempCanvas.toDataURL('image/jpeg', 1.0);

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'signature.jpg';
    link.click();

})

document.getElementById("savePdfBtn").addEventListener("click", () => {

    const { jsPDF } = window.jspdf;  // <-- IMPORTANT

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
    });

    const imgData = canvas.toDataURL("image/png");

    const pageWidth = 595;
    const pageHeight = 842;

    let imgWidth = canvas.width;
    let imgHeight = canvas.height;

    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
    imgWidth *= ratio;
    imgHeight *= ratio;

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    pdf.save("signature.pdf");
});
