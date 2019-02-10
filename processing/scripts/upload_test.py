import requests

url = "http://localhost:8000/upload"

payload = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"photo\"; filename=\"1549610440964.png\"\r\nContent-Type: image/png\r\n\r\n\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--"
headers = {
    'content-type': "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
    'cache-control': "no-cache",
    'Postman-Token': "810c4b9e-2e0a-4bd2-a1aa-c1b32edc79c0"
    }

response = requests.request("POST", url, data=payload, headers=headers)

print(response.text)