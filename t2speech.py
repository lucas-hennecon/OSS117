import os
from dotenv import load_dotenv
import requests
import json
from fastapi import FastAPI, File, UploadFile

# Load environment variables from the .env file
load_dotenv()

# Initialize FastAPI
app = FastAPI()

class SpeechToText:
    def __init__(self, api_key, api_url, content_type="audio/webm"):
        self.api_key = api_key
        self.api_url = api_url
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": content_type,
        }

    def query(self, filename):
        try:
            with open(filename, "rb") as f:
                data = f.read()
            response = requests.post(self.api_url, headers=self.headers, data=data)

            # Check the status code
            if response.status_code != 200:
                print(f"Error: {response.status_code}, {response.text}")
                return None

            # Decode the JSON response
            try:
                response_json = json.loads(response.content.decode("utf-8"))
                return response_json
            except json.JSONDecodeError as e:
                print(f"JSON Decode Error: {e}")
                print(f"Response content: {response.content}")
                return None
        except FileNotFoundError:
            print(f"File not found: {filename}")
            return None

    def forward_to_endpoint(self, data, target_url):
        try:
            response = requests.post(target_url, json=data)
            if response.status_code != 200:
                print(f"Error forwarding data: {response.status_code}, {response.text}")
                return None
            return response.json()
        except Exception as e:
            print(f"Error: {e}")
            return None


# Initialize the SpeechToText class
api_key = os.getenv("HF_API_KEY")
api_url = "https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3-turbo"
speech_to_text = SpeechToText(api_key, api_url)


@app.post("/process-audio/")
async def process_audio(file: UploadFile = File(...)):
    try:
        # Save the uploaded file locally
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Send the file to the Hugging Face API
        response = speech_to_text.query(file_path)

        # Clean up the temporary file
        os.remove(file_path)

        if response:
            # Forward the response to another FastAPI endpoint
            target_url = "http://127.0.0.1:8001/receive-data/"  # Replace with your target endpoint
            forwarded_response = speech_to_text.forward_to_endpoint(response, target_url)
            return {"status": "success", "forwarded_response": forwarded_response}
        else:
            return {"status": "error", "message": "Failed to process audio"}
    except Exception as e:
        return {"status": "error", "message": str(e)}