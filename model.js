// Create a model for image classification
function createModel() {
    const model = tf.sequential();
    
    // Convolutional layer. Convolution meaning that there's a sliding window
    // going over the image...
    model.add(tf.layers.conv2d({
        inputShape: [28, 28, 1],
        kernelSize: 5,
        filters: 8,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'VarianceScaling'
    }));
    
    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }));
    
    model.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'VarianceScaling'
    }));
    
    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }));
    
    model.add(tf.layers.flatten());
    
    model.add(tf.layers.dense({
        units: 10,
        kernelInitializer: 'VarianceScaling',
        activation: 'softmax'
    }));
    
    // Default learning rate is 0.15. Lowering this value trains slower, but should be more accurrate.
    const LEARNING_RATE = 0.15;
    
    model.compile({
        optimizer: tf.train.sgd(LEARNING_RATE), // Stochastic Gradient Descent
        loss: 'categoricalCrossentropy', // Commonly used to optimize classification tasks
        metrics: ['accuracy'], // Optimize accurracy
    });
    
    return model;
}

// Train the passed in model
async function trainModel(model) {
    // How many examples the model should "see" before making a parameter update.
    const BATCH_SIZE = 125;
    // How many batches to train the model for.
    const TRAIN_BATCHES = 200;
    
    // Every TEST_ITERATION_FREQUENCY batches, test accuracy over TEST_BATCH_SIZE examples.
    // Ideally, we'd compute accuracy over the whole test set, but for performance
    // reasons we'll use a subset.
    const TEST_BATCH_SIZE = 5000;
    const TEST_ITERATION_FREQUENCY = 5;
    
    // The mnist data set we have loaded has 30k samples, so these numbers should add up to less than 30k
    const set = mnist.set(BATCH_SIZE*TRAIN_BATCHES, TEST_BATCH_SIZE);
    
    // Construct our training set for easy input into TensorFlow.
    const trainingSetInput = [];
    const trainingSetOutput = [];
    set.training.forEach(element => {
        trainingSetInput.push(element.input);
        trainingSetOutput.push(element.output);
    });
    
    // Construct our testing set for easy input into TensorFlow.
    const testSetInput = [];
    const testSetOutput = [];
    set.test.forEach(element => {
        testSetInput.push(element.input);
        testSetOutput.push(element.output);
    });
    
    // Perform training in batches...
    for (let i = 0; i < TRAIN_BATCHES; i++) {
        const trainStartIdx = i * BATCH_SIZE;
        const trainEndIdx = trainStartIdx + BATCH_SIZE;
        
        const batchInput = trainingSetInput.slice(trainStartIdx, trainEndIdx);
        const batchOutput = trainingSetOutput.slice(trainStartIdx, trainEndIdx);
        
        // Every few batches test the accuracy of the mode.
        let validationData;
        if (i % TEST_ITERATION_FREQUENCY === 0) {
            validationData = [tf.tensor(testSetInput).reshape([testSetInput.length, 28, 28, 1]), tf.tensor(testSetOutput).reshape([testSetInput.length, 10])];
        }
        
        // The entire dataset doesn't fit into memory so we call fit repeatedly with batches.
        const history = await model.fit(
            tf.tensor(batchInput).reshape([BATCH_SIZE, 28, 28, 1]),
            tf.tensor(batchOutput).reshape([BATCH_SIZE, 10]),
            {
                batchSize: BATCH_SIZE,
                validationData,
                epochs: 1
            }
        );
        
        // Output loss vs. accuracy...
        console.log('Current loss: ' + history.history.loss[0] + ' and accuracy: ' + history.history.acc[0]);
    }
}

// Returns the prediction made by the model after passing it the input
function predictWithModel(model, input) {
    return model.predict(input);
}
