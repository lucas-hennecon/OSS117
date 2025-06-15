import requests
import os
from pathlib import Path
import mimetypes

class WhisperTranscriber:
    def __init__(self, hf_token, endpoint_url):
        """
        Initialize the transcriber with your Hugging Face endpoint.
        
        Args:
            hf_token (str): Your Hugging Face API token
            endpoint_url (str): Your Hugging Face endpoint URL
        """
        self.hf_token = hf_token
        self.api_url = endpoint_url
        self.headers = {
            "Accept": "application/json",
            "Authorization": f"Bearer {hf_token}"
        }
    
    def get_content_type(self, file_path):
        """
        Get the appropriate content type for the audio file.
        
        Args:
            file_path (str): Path to the audio file
            
        Returns:
            str: Content type for the file
        """
        mime_type, _ = mimetypes.guess_type(file_path)
        if mime_type and mime_type.startswith('audio/'):
            return mime_type
        
        # Fallback based on file extension
        ext = Path(file_path).suffix.lower()
        content_types = {
            '.flac': 'audio/flac',
            '.wav': 'audio/wav',
            '.mp3': 'audio/mpeg',
            '.m4a': 'audio/mp4',
            '.ogg': 'audio/ogg',
            '.webm': 'audio/webm'
        }
        return content_types.get(ext, 'audio/wav')
    
    def transcribe_audio(self, audio_file_path):
        """
        Transcribe audio file to text using your Hugging Face endpoint.
        
        Args:
            audio_file_path (str): Path to the audio file
        
        Returns:
            str: Transcribed text or error message
        """
        try:
            # Check if file exists
            if not os.path.exists(audio_file_path):
                return f"Error: File '{audio_file_path}' not found."
            
            # Get the appropriate content type
            content_type = self.get_content_type(audio_file_path)
            
            # Set content type header
            headers = self.headers.copy()
            headers["Content-Type"] = content_type
            
            # Read the audio file
            with open(audio_file_path, "rb") as f:
                audio_data = f.read()
            
            # Make the API request
            response = requests.post(
                self.api_url,
                headers=headers,
                data=audio_data
            )
            
            # Check if request was successful
            if response.status_code == 200:
                result = response.json()
                # Handle different response formats
                if isinstance(result, dict):
                    return result.get("text", result.get("transcription", str(result)))
                elif isinstance(result, list) and len(result) > 0:
                    return result[0].get("text", str(result[0]))
                else:
                    return str(result)
            else:
                return f"Error: {response.status_code} - {response.text}"
                
        except Exception as e:
            raise e
    
    def transcribe_multiple_files(self, audio_files, output_dir=None):
        """
        Transcribe multiple audio files.
        
        Args:
            audio_files (list): List of audio file paths
            output_dir (str, optional): Directory to save transcription files
        
        Returns:
            dict: Dictionary with file paths as keys and transcriptions as values
        """
        results = {}
        
        for audio_file in audio_files:
            print(f"Transcribing: {audio_file}")
            transcription = self.transcribe_audio(audio_file)
            results[audio_file] = transcription
            
            # Save to file if output directory is specified
            if output_dir and not transcription.startswith("Error"):
                os.makedirs(output_dir, exist_ok=True)
                output_file = os.path.join(
                    output_dir, 
                    f"{Path(audio_file).stem}_transcription.txt"
                )
                with open(output_file, "w", encoding="utf-8") as f:
                    f.write(transcription)
                print(f"Saved transcription to: {output_file}")
        
        return results

def main():
    """
    Example usage of the WhisperTranscriber class with your endpoint.
    """
    # Your Hugging Face endpoint URL and token
    ENDPOINT_URL = "https://m2c24s49nb5yd2y5.us-east-1.aws.endpoints.huggingface.cloud/v1/"
    HF_TOKEN =   # Replace with your actual token
    
    # Initialize the transcriber
    transcriber = WhisperTranscriber(HF_TOKEN, ENDPOINT_URL)
    
    # Example 1: Transcribe a single audio file
    audio_file = "hello.m4a"  # Change this to your audio file path
    
    print("Transcribing audio file...")
    transcription = transcriber.transcribe_audio(audio_file)
    print(f"Transcription: {transcription}")
    
    # Example 2: Transcribe multiple files
    # audio_files = [
    #     "sample1.flac",
    #     "sample2.wav",
    #     "sample3.mp3"
    # ]
    # results = transcriber.transcribe_multiple_files(audio_files, output_dir="transcriptions")

if __name__ == "__main__":
    # Alternative: Load from environment variables for security
    # ENDPOINT_URL = os.getenv("HF_ENDPOINT_URL", "https://m2c24s49nb5yd2y5.us-east-1.aws.endpoints.huggingface.cloud")
    # HF_TOKEN = os.getenv("HUGGING_FACE_TOKEN")
    
    # if not HF_TOKEN:
    #     print("Please set your Hugging Face token:")
    #     print("1. As an environment variable: export HUGGING_FACE_TOKEN='your_token'")
    #     print("2. Or modify the HF_TOKEN variable in the main() function")
    #     exit(1)
    
    # # Example usage with environment variables
    # transcriber = WhisperTranscriber(HF_TOKEN, ENDPOINT_URL)
    
    # # Replace with your actual audio file path
    # audio_file = input("Enter the path to your audio file: ").strip()
    
    # if audio_file:
    #     print("Transcribing...")
    #     result = transcriber.transcribe_audio(audio_file)
    #     print(f"\nTranscription Result:\n{result}")
    # else:
    #     print("No audio file specified.")
    #main()
    