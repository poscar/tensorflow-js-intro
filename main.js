document.addEventListener("DOMContentLoaded", () => {
    // Execute our main function after DOM is loaded.
    main();
});

function main() {
    // Create our Model
    const numberRecognizerModel = createModel();
    
    const padCanvas = document.getElementById("drawPad");
    const padContext = padCanvas.getContext("2d");
    
    let mouseDownInDrawPad = false;
    let lastX = 0;
    let lastY = 0;
    function updateMouseStates(mouseDown, x, y) {
        mouseDownInDrawPad = mouseDown;
        lastX = x;
        lastY = y;
    }
    
    padCanvas.addEventListener('mousedown', (event) => {
        drawPixel(padContext, lastX, lastY, event.offsetX, event.offsetY);
        
        // Update mouse states
        updateMouseStates(true, event.offsetX, event.offsetY);
    });
    padCanvas.addEventListener('mousemove', (event) => {
        if (mouseDownInDrawPad) {
            drawPixel(padContext, lastX, lastY, event.offsetX, event.offsetY);
            
            // Update mouse states
            updateMouseStates(mouseDownInDrawPad, event.offsetX, event.offsetY);
        }
    });
    window.addEventListener('mouseup', (event) => {
        if (mouseDownInDrawPad) {
            // We will trigger digit recognition after the user
            // finishes drawing a segment.
            recognizeDigitWithModel(numberRecognizerModel);
            
            // Reset mouse states
            updateMouseStates(false, 0, 0);
        }
    });
    
    document.getElementById("train").addEventListener("click", async () => {
        // Execute model training.
        await trainModel(numberRecognizerModel);
    });
    
    document.getElementById("clear").addEventListener('click', () => {
        // Clear drawPad canvas by initializing it with black.
        initBlackCanvas(padContext, padCanvas.width, padCanvas.height)
    });
    
    // Initialize the drawPad canvas with black
    initBlackCanvas(padContext, padCanvas.width, padCanvas.height)
}

function recognizeDigitWithModel(model) {
    const padCanvas = document.getElementById("drawPad");
    const tfInputCanvas = document.getElementById("tfInput");
    const tfInputContext = tfInputCanvas.getContext("2d");
    
    // Reset to identity matrix to unset any previous scale calls...
    tfInputContext.setTransform(1, 0, 0, 1, 0, 0);
    
    // Scale down the image from the drawPad into a size expected by the mode...
    tfInputContext.clearRect(0, 0, tfInputCanvas.width, tfInputCanvas.height);
    tfInputContext.scale(0.1, 0.1);
    tfInputContext.drawImage(padCanvas, 0, 0);
    
    // Get and process the scaled down image data building an array of values matching the mnist dataset...
    const digitImage = tfInputContext.getImageData(0, 0, tfInputCanvas.width, tfInputCanvas.height);
    const bwImage = [];
    for (let pixelIdx = 0; pixelIdx < (digitImage.height * digitImage.width * 4); pixelIdx += 4) {
        const r = digitImage.data[pixelIdx];
        const g = digitImage.data[pixelIdx + 1];
        const b = digitImage.data[pixelIdx + 2];
        const a = digitImage.data[pixelIdx + 3];
        
        const avgPixVal = (r + g + b) / 3;
        bwImage.push(avgPixVal / 255);
    }
    
    const inputTensor = tf.tensor(bwImage).reshape([1, 28, 28, 1]);
    const prediction = predictWithModel(model, inputTensor);
    
    // Print the prediction itself
    prediction.print();
    
    // Get the index of the output with the highest probability
    const digitIdx = prediction.argMax(1).get(0);
    
    // Set the output in HTML
    setOutputToDigit(digitIdx);
}

function setOutputToDigit(idx) {
    console.log('Setting digit: ' + idx);
    const outputElement = document.getElementById("output");
    
    if (idx >= 0 && idx <= 9) {
        outputElement.innerHTML = idx.toString();
    } else {
        outputElement.innerHTML = "Unknown!";
    }
}
