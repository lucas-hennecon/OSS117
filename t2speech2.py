import requests
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Access the API key
api_key = os.getenv("HF_API_KEY")

audio_file_path = "hello.m4a"

headers = {"Authorization": f"Bearer {api_key}"}
API_URL = "https://api-inference.huggingface.co/models/openai/whisper-large-v3"


def query(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.request("POST", API_URL, headers=headers, data=data)
    return response


data = query(audio_file_path)
print(data)