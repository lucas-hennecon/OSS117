import os
from dotenv import load_dotenv
import requests
import json

# Load environment variables from the .env file
load_dotenv()

# Access the API key
api_key = os.getenv("HF_API_KEY")

headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "audio/m4a"}
API_URL = (
    "https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3-turbo"
)


def query(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.request("POST", API_URL, headers=headers, data=data)

    # Check the status code
    if response.status_code != 200:
        print(f"Error: {response.status_code}, {response.text}")
        return None

    # Decode the JSON response
    try:
        return json.loads(response.content.decode("utf-8"))
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        print(f"Response content: {response.content}")
        return None


data = query("test2.m4a")
print(data)
