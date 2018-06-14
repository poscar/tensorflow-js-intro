// Initializes the passed canvas context and fills it with black
// using the specified dimensions
function initBlackCanvas(ctx, width, height) {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.rect(0, 0, width, height);
    ctx.fill();
}

// Draws a pixe in the specified canvas context using previous and 
// new pointer values.
function drawPixel(ctx, lastX, lastY, newX, newY) {
    const size = document.getElementById("brushWidth").value;
    
    // This block is needed to make sure we interpolate a line between
    // multiple mouse events that were sampled too far apart and would otherwise
    // result in an empty line section being drawn.
    if (lastX && lastY && (newX !== lastX || newY !== lastY)) {
        ctx.lineWidth = 2 * size;
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(newX, newY);
        ctx.stroke();
    }
    
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(newX, newY, size, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
}

// Function to debug the TensorFlow.js Input canvas where we will be getting
// pixel values from.
function debugTfInputCanvas() {
    const tfInputCanvas = document.getElementById("tfInput");
    const tfInputContext = tfInputCanvas.getContext("2d");
    
    const targetIdx = Math.floor(Math.random() * Math.floor(mnist.length));
    const targetInput = mnist[targetIdx].get();
    const targetOutput = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    targetOutput[targetIdx] = 1;
    
    console.log('Attempting to draw: ' + targetOutput);
    
    const digitImage = tfInputContext.createImageData(28, 28);
    for (let pixelIdx = 0; pixelIdx < digitImage.height * digitImage.width; pixelIdx++) {
        const pixelColor = targetInput[pixelIdx];
        const pixelTargetIdx = pixelIdx * 4;
        digitImage.data[pixelTargetIdx] = pixelColor * 255;
        digitImage.data[pixelTargetIdx + 1] = pixelColor * 255;
        digitImage.data[pixelTargetIdx + 2] = pixelColor * 255;
        
        // Alpha
        digitImage.data[pixelTargetIdx + 3] = 255;
        
    }
    tfInputContext.putImageData(digitImage, 0, 0);
}
