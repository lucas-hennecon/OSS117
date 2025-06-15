# OSS117

**Your personal AI-powered fact-checking assistant.**

## 🚀 Getting Started

Follow these steps to run the project locally
clone the repo on your machine, then: 

1. **Create a virtual environment**  
   (e.g., with `python -m venv venv`)

2. **Activate the environment**  
   - On macOS/Linux: `source venv/bin/activate`  
   - On Windows: `venv\Scripts\activate`

3. **Install Python dependencies**  
   ```bash
   pip install -r requirements.txt
   ```

4. **Install npm**  
   (e.g., with Homebrew on macOS)  
   ```bash
   brew install npm
   ```
5. **Launch the app**
```bash
   make dev
   ```
6. **Test the app**  
   Visit [http://localhost:8080/](http://localhost:8080/) in your browser.

7. **Start fact-checking!**  
   Use the interface to analyze text, audio, or X accounts, and never get fooled again.

---

## 🧠 Features

- **📝 Text Analysis**  
  Paste any text, and our AI agent will identify and debunk false claims.

- **🎙️ Speech Analysis**  
  Record or upload audio to fact-check conversations in real time.

- **📱 X (Twitter) Analysis**  
  Enter an X account handle to check and analyze posts for misinformation.

---

## ⚙️ How It Works

Our system combines state-of-the-art AI tools to deliver accurate and fast fact-checking:

- **Audio Transcription**:  
  Uses `whisper-large-v3-turbo` to transcribe spoken content into text.

- **Fact Identification & Verification**:  
  Employs Hugging Face’s `smolagent` framework and Anthropic’s **Claude 4 Sonnet** to:
  1. Detect factual claims.
  2. Search the web for relevant sources.
  3. Verify the accuracy of the information.

---

## 🛠️ Tech Stack

- Python (backend)
- Node.js / npm (frontend)
- Claude 4 Sonnet (LLM)
- Hugging Face `smolagents`
- OpenAI Whisper (audio transcription)
