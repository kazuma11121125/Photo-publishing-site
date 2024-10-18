import cv2
import os
from tqdm import tqdm

# 画像フォルダのパス
input_dir = 'public/images'
output_dir = 'public/deterioration'
# 圧縮後の画像の幅
width = 720

# 出力フォルダがなければ作成
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# 画像ファイルのリストを取得
image_files = [f for f in os.listdir(input_dir) if f.endswith(('.jpg', '.png', '.jpeg', '.JPG', '.PNG', '.JPEG'))]

for i, image_file in enumerate(tqdm(image_files, desc="Processing images", ncols=100)):
    # 画像を読み込む
    img_path = os.path.join(input_dir, image_file)
    img = cv2.imread(img_path)

    if img is None:
        continue 
    height = int(img.shape[0] * (width / img.shape[1]))
    resized_img = cv2.resize(img, (width, height), interpolation=cv2.INTER_AREA)

    # 圧縮後の画像を保存
    output_path = os.path.join(output_dir, image_file)
    cv2.imwrite(output_path, resized_img)
print('Done!')
