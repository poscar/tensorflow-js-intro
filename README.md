# tensorflow-js-intro

Introduction to [TensorFlow.js](https://js.tensorflow.org/) by building a web app that
is able to recognize hand drawn digits in a [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
element.

In this introduction we will:
1. Create a simple TensorFlow.js project.
1. Load a [subset](https://github.com/cazala/mnist/) of the [MNIST](http://yann.lecun.com/exdb/mnist/) digit dataset.
1. Create a model that is able to predict the numeric value of a handwritten digit.
1. Train the model.
1. Allow users to draw digits using the Canvas.
1. Use our model to recognize user drawn digits.

## Slides

This project was created for the [Fullstack](https://www.meetup.com/javascript-full-stack-development/) meetup in NYC on June 14th, 2018. You can find the companion slides [here](https://docs.google.com/presentation/d/1kD5ZWJ5OJZf8S08TQtUwBE9166sIOT-bwbtOu0iZSWs/edit?usp=sharing).

## Resources

The following resources were used to create this project:

- [TensorFlow.js MNIST Tutorial](https://js.tensorflow.org/tutorials/mnist.html): Steps to build and train the DNN to recognize digits. **NOTE** that we
were heavily inspired by this tutorial, but did not exactly follow it.
- [MNIST Digits](https://github.com/cazala/mnist/): Subset of the MNIST dataset for easy consumption within JavaScript.
- [MNIST Digits data loader](https://github.com/ApelSYN/mnist_dl): To be used with the tool above for generating larger MNIST data subsets.

## Further Work

If you would like to experiment further, I challenge you to improve the performance of the model by
modifying the hyperparameters (e.g. structure, learning rate, etc...) of the neural network or training
the model over a larger MNIST subset.
