import sharp from "sharp";
import Image from "next/image";
import path from 'path';
import fs from 'fs';

async function getImages() {
    const imagesDir = path.join(process.cwd(), "public/images");
    const deteriorationDir = path.join(process.cwd(), "public/deterioration");
    const files = fs.readdirSync(imagesDir);

    // 各画像のメタデータを取得
    const images = await Promise.all(
        files.map(async (file) => {
            const deteriorationPath = path.join(deteriorationDir, file);
            const originalPath = path.join(imagesDir, file);

            const metadata = await sharp(deteriorationPath).metadata();
            const width = (metadata.width ?? 720);
            const height = (metadata.height ?? 480);
            
            return {
                deteriorationSrc: `/Photo-publishing-site/deterioration/${file}`,
                originalSrc: `/Photo-publishing-site/images/${file}`,
                width,
                height
            };
        })
    );

    return images;
}

export default async function Home() {
    const images = await getImages();
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 w-full gap-4">
            {images.map((image) => (
                <div key={image.originalSrc}>
                    {/* 圧縮版を表示 */}
                    <Image 
                        alt={image.originalSrc} 
                        src={image.deteriorationSrc} 
                        width={image.width}
                        height={image.height} 
                        quality={1}
                    />
                    {/* 元画像のダウンロードリンク */}
                    <a href={image.originalSrc} download>
                        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Download
                        </button>
                    </a>
                </div>
            ))}
        </div>
    );
}
