from matplotlib import pyplot as plt
from tensorflow.keras import models, layers, datasets
import os
import random
import tensorflow as tf

# this is so that the code under this if statment is not run when we import something from this script
if __name__ == "__main__":
    # create output directoru if it doesn't already exist
    if not os.path.exists("output"):
        os.mkdir("output")
