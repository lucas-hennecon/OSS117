import os
import base64
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

# Load environment variables from the .env file
load_dotenv()

# Access the API key
api_key = os.getenv("HF_API_KEY")

audio_file_path = "test2.flac"

# Read and encode the audio file in base64
with open(audio_file_path, "rb") as audio_file:
    audio_base64 = base64.b64encode(audio_file.read()).decode("utf-8")

client = InferenceClient(provider="hf-inference", api_key=api_key)

# Pass the base64-encoded string to the method
output = client.automatic_speech_recognition(
    audio_base64, model="openai/whisper-large-v3"
)

# Decode the base64-encoded output
decoded_output = base64.b64decode(output.text).decode("utf-8")

print(decoded_output)
