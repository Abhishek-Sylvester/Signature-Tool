const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let history  =[];

function resizeCanvas(){
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
}

resizeCanvas();

let drawing = false;
let penWidth = 2;
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

    ctx.lineWidth = penWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function endDraw() {
    if (!drawing) return;

    drawing = false;
    ctx.closePath();
    saveState();
}

function saveState(){
    history.push(canvas.toDataURL())
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
    history = [];
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

document.getElementById("undoBtn").addEventListener("click", () =>{
    if(history.length == 0){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    history.pop(); // remove current state

    const img = new Image();

    if (history.length > 0) {
        img.src = history[history.length - 1];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
})

/*const thicknessButtons = document.querySelectorAll(".thick-btn");
thicknessButtons[0].classList.add("active");*/

/*thicknessButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        // Remove active from all
        thicknessButtons.forEach(b => b.classList.remove("active"));

        // Mark clicked as active
        btn.classList.add("active");

        // Update pen size
        penWidth = parseInt(btn.getAttribute("data-size"));
    });
});*/
