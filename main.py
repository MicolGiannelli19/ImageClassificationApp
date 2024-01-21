from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from mangum import Mangum
import os


#  We instantiate the app

app = FastAPI()


# We want to serve ourt react application at root
app.mount(
    "/",
    StaticFiles(directory=os.path.join("frontend", "build"), html=True),
    name="build",
)

# setting up CORS (cross orgin rescource settings)
# the allow [*] means that is allowing all of them (for now we are pretty much allowing everything just so we don't have to deal with this when working wiht the diffrent part of this repo)
app.add_middleware(
    CORSMiddleware,
    allow_orgins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mangum
handler = Mangum(app)


# This is to prevemt the lambda from showing errors in cloud watch
def lambda_handler(event, context):
    if "source" in event and event["source"] == "aws.events":
        print("This is a warm up invocation")
        return {}
    else:
        return handler(event, context)
