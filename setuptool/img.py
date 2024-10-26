import cv2
import os
from tqdm import tqdm
from PIL import Image, ImageDraw, ImageFont
from PIL.ExifTags import TAGS
import numpy as np

# 画像フォルダのパス
input_dir = 'public/images'
output_dir = 'public/deterioration'
photographer_name = "kazuma1112"

# 圧縮後の画像の幅
width = 720
if not os.path.exists(output_dir):os.makedirs(output_dir)

image_files = [f for f in os.listdir(input_dir) if f.endswith(('.jpg', '.png', '.jpeg', '.JPG', '.PNG', '.JPEG'))]

def get_exif_data(image_path):
    try:
        image = Image.open(image_path)
        exif_data = image._getexif()
        if exif_data is not None:
            exif_info = {}
            for tag, value in exif_data.items():
                tag_name = TAGS.get(tag, tag)
                exif_info[tag_name] = value
            return exif_info
        else:
            print("Exif information not found.")
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def get_datetime_and_camera(exif_info):
    datetime_original = None
    camera_name = None
    if exif_info is not None:
        datetime_original = exif_info.get('DateTimeOriginal')
        make = exif_info.get('Make')
        model = exif_info.get('Model')
        camera_name = f"{make} {model}" if make and model else None
    return datetime_original, camera_name

def add_text_to_image(image, text, position=(10, 10), font_size=20):
    pil_image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(pil_image)
    try:
        font = ImageFont.truetype("arial.ttf", font_size) if font_size else ImageFont.load_default()
    except IOError:
        print("Font not found. Using default font.")
        font = ImageFont.load_default()
    draw.text(position, text, fill="white", font=font)
    return cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)

for image_file in tqdm(image_files, desc="Processing images", ncols=100):
    img_path = os.path.join(input_dir, image_file)
    img = cv2.imread(img_path)
    if img is None:continue 
    height = int(img.shape[0] * (width / img.shape[1]))
    datetime_original, camera_name = get_datetime_and_camera(get_exif_data(img_path))
    text = f"Shooting Date: {datetime_original or 'N/A'}\nCamera: {camera_name or 'N/A'}\nPhotographer: {photographer_name}"
    final_img = add_text_to_image(cv2.resize(img, (width, height), interpolation=cv2.INTER_AREA), text, position=(10, height - 40), font_size=10)
    cv2.imwrite(os.path.join(output_dir, image_file), final_img)

print('Done!')