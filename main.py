from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from mangum import Mangum
from PIL import Image
from pydantic import BaseModel

# do we actually need tensorflow is that a mistake here
# from tensorflow.keras import models
import numpy as np
import os
import tensorflow as tf


# TODO: defiene a function that accepts an image and r
# Instantiate the app
app = FastAPI()


# Ping test method (By runninf a get method on the app we created and definaning an endpoint
@app.get("/ping")
def ping():
    return "pong!"


class SumInput(BaseModel):
    a: int
    b: int


class SumOutput(BaseModel):
    sum: int


# Why did we define the atributes like this rather then in the init method what is the point of having these classes
class DimensionsOutput(BaseModel):
    width: int
    height: int


# Sum two numbers together
@app.post("/sum")
def sum(input: SumInput):
    return SumOutput(sum=input.a + input.b)


# defininf a post method that takes and image and returns its dimensions
# NOTE: this takes a foto file as an object we will need to define this with a particualar syntax
# TODO: learn more about this in
@app.post("/dimensions")
def dimensions(file: UploadFile = File(...)):
    # would be very intresting to find out what this format is
    print("the function is being called")
    image = Image.open(file.file)
    image_array = np.array(image)

    width = image_array.shape[1]
    height = image_array.shape[0]

    print(f"Width: {width}, Height: {height}")

    return DimensionsOutput(width=width, height=height)


# Server our react application at the root
app.mount(
    "/",
    StaticFiles(directory=os.path.join("frontend", "build"), html=True),
    name="build",
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits requests from all origins.
    # Allows cookies and credentials to be included in the request.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods.
    allow_headers=["*"],  # Allows all headers.
)

# Define the Lambda handler
handler = Mangum(app)


# Prevent Lambda showing errors in CloudWatch by handling warmup requests correctly
def lambda_handler(event, context):
    if "source" in event and event["source"] == "aws.events":
        print("This is a warm-ip invocation")
        return {}
    else:
        return handler(event, context)
