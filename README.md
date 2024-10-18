# Image Library - Display your customized image

`public/images/`直下に置いた画像を表示します。

## How to use

1. `Fork this repo`
2. `set public/images`
3. `pip install opencv-python tqdm`
4. `python3 setuptool/img.py`
5. `python3 setuptool/git.py`

※一部変更する必要がある可能性あり

end

## Licence

MIT. - (c) akikaki kazuma1112 2024

## Warning

表示される画像は劣化版です。  
必ずpublic/imagesからpublic/deteriorationにmg.pyで変換してください。ファイル名は同じ必要があります。  
gitset.pyは上手くいかない可能性があります。githubの仕様上2GBを超えるとpushができなくなります。そのため、1GBに分割してpushを行う自動スクリプトです。  
