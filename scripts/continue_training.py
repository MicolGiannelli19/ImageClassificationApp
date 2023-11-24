from tensorflow.keras import datasets, models
import os
import tensorflow as tf

if __name__ == "__main__":
    # Load data
    (train_images, train_labels), (
        test_images,
        test_labels,
    ) = datasets.cifar10.load_data()

    # Normalise pixels values
    train_images, test_images = train_images / 255.0, test_images / 255.0

    # Load model
    init_model_path = os.path.join("output", "model.h5")
    model = models.load_model(init_model_path)

    # Train the model
    model.compile(
        optimizer="adam",
        loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False),
        metrics=["accuracy"],
    )

    # Training loop
    epoch_counter = 0
    epochs_per_iteration = 4

    while True:
        history = model.fit(
            train_images,
            train_labels,
            epochs=epochs_per_iteration,
            validation_data=(test_images, test_labels),
        )
        epoch_counter += epochs_per_iteration

        model.save("output", "model.h5")
        #  this doesn't seem to be working for me beasue the model is exactly the same as before

        print(f"Total number of epochs this train session: {epoch_counter}")

        # Maybe test the classify image fucntion form here and also try re draring the histogram evey time edit this code slightly to makes some checks
