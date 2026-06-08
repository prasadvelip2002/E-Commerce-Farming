import urllib.request

urls = [
    ("drum_stick_1", "https://image.pollinations.ai/prompt/moringa%20drumstick%20raw%20agricultural%20crop%20field%20harvest?width=800&height=600&nologo=true"),
    ("drum_stick_2", "https://image.pollinations.ai/prompt/moringa%20oleifera%20drumstick%20vegetable%20raw%20agricultural%20crop?width=800&height=600&nologo=true"),
    ("drum_stick_3", "https://image.pollinations.ai/prompt/Drum%20Stick%20vegetable%20raw%20vegetable%20fruit%20agricultural%20crop%20field%20harvest?width=800&height=600&nologo=true")
]

for name, url in urls:
    print(f"Downloading {name}...")
    try:
        urllib.request.urlretrieve(url, f"{name}.jpg")
        print(f"Downloaded {name}.jpg")
    except Exception as e:
        print(f"Failed {name}: {e}")
