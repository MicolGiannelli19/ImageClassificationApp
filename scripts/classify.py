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
        print(f"{class_name} = {probility}")
