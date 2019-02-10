import requests
from requests_toolbelt import MultipartEncoder
import imghdr


url = "http://localhost:8000/upload"

m = MultipartEncoder(
    fields={'photo': ('samoyed.jpg', open('samoyed.jpg', 'rb'), 'image/jpeg')}
)

response = requests.request("POST", url, data=m, headers={'Content-Type': m.content_type})

print(response.text)