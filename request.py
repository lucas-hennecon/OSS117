import requests
import json

url = "http://127.0.0.1:8000/api/chat"
headers = {
    "Content-Type": "application/json"
}
data = {
    "input_text": "Google a un chiffre d'affaire de 10euros"
}

response = requests.post(url, headers=headers, data=json.dumps(data))

if response.status_code == 200:
    print("Réponse de l'API :", response.json())
else:
    print("Erreur :", response.status_code, response.text)
