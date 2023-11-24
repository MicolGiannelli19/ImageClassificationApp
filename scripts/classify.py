from matplotlib import pyplot as plt
from tensorflow.keras import models, preprocessing, Model
import os
import sys
import tensorflow as tf
import numpy as np

from train import CLASS_NAMES


def read_command_line_arguments():
    if len(sys.argv) != 2:
        print(f"Requires exactly 1 input, but recieved {len(sys.argv)-1}")
        print("Use:python scripts/classify.py <path/to/image.png>")
        exit()
    input_image_filepath = sys.argv[1]
    return input_image_filepath


def load_image(path):
    # Load the image in ad resize it to match wht the model expects
    image = preprocessing.image.load_img(path, target_size=(32, 32))

    # convert image to array
    image_array = preprocessing.image.img_to_array(image)

    # Expand dimensions for batch processing
    image_batch = tf.expand_dims(image_array, 0)

    # Normalse image
    image_batch /= 255.0

    return image_batch


def visualize_intermediate_layers(model, image_batch, layer_names):
    # Get the outputs of each layer in the model
    layer_outputs = [layer.output for layer in model.layers]

    # Create a new model for visualizing the intermediate layers
    activation_model = Model(inputs=model.input, outputs=layer_outputs)

    # get the layer activation
    activations = activation_model.predict(image_batch)

    # Loop through each layer and visualize the activations
    for layer_name, activation in zip(layer_names, activations):
        layer_dir = os.path.join("output", f"activations_{layer_name}")
        if not os.path.exists(layer_dir):
            os.makedirs(layer_dir)

        num_channels = activation.shape[-1]
        for i in range(num_channels):
            plt.figure()
            plt.imshow(activation[0, :, :, i], cmap="viridis")
            plt.axis("off")
            plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
            plt.savefig(
                os.path.join(layer_dir, f"channel_{i}.png"),
                bbox_inches="tight",
                pad_inches=0,
            )
            plt.close()


if __name__ == "__main__":
    # Read image filepath from comand line
    input_image_filepath = read_command_line_arguments()
    print(f"Input image path: {input_image_filepath}")

    # Load preproccess the image
    image_batch = load_image(input_image_filepath)

    # Load pre-trained model
    model = models.load_model(os.path.join("output", "model.h5"))

    # Preform the image classification
    predictions = model.predict(image_batch)[0]
    predicted_class = np.argmax(predictions)

    for i in range(len(predictions)):
        class_name = CLASS_NAMES[i].ljust(16, " ")
        probility = "{:.1f}".format(predictions[i] * 100)
        print(f"{class_name} = {probility}%")

    # Visualise activations of intermidiate layers
    layer_names = [
        layer.name
        for layer in model.layers
        if "conv" in layer.name or "dense" in layer.name
    ]
    visualize_intermediate_layers(model, image_batch, layer_names)
