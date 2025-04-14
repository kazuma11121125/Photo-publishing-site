import Image from "next/image";
import fs from "fs";
import path from "path";

export default function Home({ params }: { params: { folder?: string } }) {
    const folder = params.folder || "OITA_YUME_HANABI";
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

    const publicPath = path.join(process.cwd(), "public");
    const folders = fs.readdirSync(publicPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    let images: { deteriorationSrc: string; originalSrc: string; width: number; height: number; }[] = [];

    try {
        images = require(`../public/${folder}/images.json`);
    } catch (error) {
        console.error(`Failed to load images for folder: ${folder}`, error);
    }

    return (
        <div>
            {/*テキスト*/}
            <div className="mt-4 text-center">
                <p className="text-lg font-bold">画像のダウンロード</p>
                <p>画像の圧縮版は、元画像のサイズを小さくしたものです。</p>
                <p>元画像をダウンロードするには、各画像の「Download」ボタンをクリックしてください。</p>
            </div>
            <div className="mt-4 text-center">
                <p className="text-lg font-bold">撮影依頼について</p>
                <p>撮影依頼は、<a href="https://www.instagram.com/kazuma11121125/" className="text-blue-500 underline">Instagram</a>のDMまでお願いします。</p>
                <p>撮影内容によってはお受けできない場合がありますので、ご了承ください。</p>
            </div>
            <div className="mt-4 text-center">
                <p className="text-lg font-bold">寄付</p>
                <p>写真撮影のための活動費(撮影機材、維持費...etc)を募集しています。</p>
                <p><a href="https://www.amazon.jp/hz/wishlist/ls/32ME1VSWCHFTB?ref_=wl_share" className="text-blue-500 underline">Amazon 欲しい物リスト</a></p>
                <p>また、DMでも受け付けています。ご協力よろしくお願いいたします。</p>
            
            </div>
            {/* メニューバー */}
            <div className="flex space-x-4 mb-4">
                {folders.map((folderName) => (
                    <a key={folderName} href={`${basePath}/${folderName}`}>
                        <button 
                            className={`px-4 py-2 ${folder === folderName ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            {folderName}
                        </button>
                    </a>
                ))}
            </div>

            {/* 画像表示 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 w-full gap-4">
                {images.map((image) => {
                    const isValidImage = image.deteriorationSrc.endsWith(".jpg") || image.deteriorationSrc.endsWith(".jpeg") || image.deteriorationSrc.endsWith(".png") || image.deteriorationSrc.endsWith(".JPG") || image.deteriorationSrc.endsWith(".JPEG") || image.deteriorationSrc.endsWith(".PNG");
                    return (
                        <div key={image.originalSrc}>
                            {isValidImage ? (
                                <>
                                    {/* 圧縮版を表示 */}
                                    <Image 
                                        alt={image.originalSrc} 
                                        src={`${basePath}${image.deteriorationSrc.startsWith("/") ? image.deteriorationSrc : `/${image.deteriorationSrc}`}`} 
                                        width={image.width}
                                        height={image.height} 
                                        quality={1}
                                    />
                                    {/* 元画像のダウンロードリンク */}
                                    <a 
                                        href={`${basePath}${image.originalSrc.startsWith("/") ? image.originalSrc : `/${image.originalSrc}`}`} 
                                        download
                                    >
                                        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                            Download
                                        </button>
                                    </a>
                                </>
                            ) : (
                                <div className="text-red-500">
                                    Invalid image: {image.deteriorationSrc}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export async function generateStaticParams() {
    const publicPath = path.join(process.cwd(), "public");
    const folders = fs.readdirSync(publicPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => ({ folder: dirent.name }));

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    return folders.map(({ folder }) => ({
        folder: `${basePath}/${folder}`,
    }));
}