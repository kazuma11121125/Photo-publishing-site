import cv2
import os
from tqdm import tqdm
import shutil
import threading
import json

input_path = str(input('input path: '))

output_name = str(input('output name: '))
output_name = output_name.replace(' ', '_')
output_name = output_name.replace('　', '_')
output_path = os.path.join('public/', output_name)

github_base_path = "/Photo-publishing-site/"

if not os.path.exists(output_path):os.makedirs(output_path)
if not os.path.exists(os.path.join(output_path, 'image')):os.makedirs(os.path.join(output_path, 'image'))
if not os.path.exists(os.path.join(output_path, 'deterioration')):os.makedirs(os.path.join(output_path, 'deterioration'))
if not os.path.exists(os.path.join(output_path, 'images.json')):open(os.path.join(output_path, 'images.json'), 'w').close()
with open(os.path.join(output_path, 'images.json'), 'w') as f:json.dump([], f, indent=4)

# 画像ファイルのリストを取得
image_files = [f for f in os.listdir(input_path) if f.endswith(('.jpg', '.png', '.jpeg', '.JPG', '.PNG', '.JPEG'))]

def copy():
    print('Copying images...')
    for image_file in tqdm(image_files, desc="Copying images", ncols=100):
        img_path = os.path.join(input_path, image_file)
        output_img_path = os.path.join(output_path, 'image', image_file)
        shutil.copy(img_path, output_img_path)

def resize_and_save():
    with open(os.path.join(output_path, 'images.json'), 'r') as f:
        json_data:list = json.load(f)
    print('Resizing and saving images...')
    for i, image_file in enumerate(tqdm(image_files, desc="Processing images", ncols=100)):
        img_path = os.path.join(input_path, image_file)
        img = cv2.imread(img_path)

        if img is None:continue 
        height, width = img.shape[:2]
        ratio = width / height
        if ratio > 1:
            new_width = 720
            new_height = int(new_width / ratio)
        else:
            new_height = 720
            new_width = int(new_height * ratio)
        # 画像をリサイズ
        resized_img = cv2.resize(img, (new_width, new_height), interpolation=cv2.INTER_AREA)

        output_deterioration = os.path.join(output_path,'deterioration',image_file)
        cv2.imwrite(output_deterioration, resized_img)
        # JSONデータに追加
        deteriorationSrc  = os.path.join(github_base_path,output_name, 'deterioration', image_file)
        originalSrc = os.path.join(github_base_path,output_name, 'image', image_file)
        json_data.append({
            "deteriorationSrc": deteriorationSrc,
            "originalSrc": originalSrc,
            "width": new_width,
            "height": new_height
        })
        with open(os.path.join(output_path, 'images.json'), 'w') as f:
            json.dump(json_data, f, indent=4)

thread_copy = threading.Thread(target=copy)

thread_resize = threading.Thread(target=resize_and_save)
thread_copy.start()
thread_resize.start()

thread_copy.join()
thread_resize.join()
