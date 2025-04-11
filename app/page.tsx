import Image from "next/image";
import publicImages from "../public/images.json";
import public2Images from "../public2/images.json";

export default function Home({ params }: { params: { folder?: string } }) {
    const folder = params.folder || "public";
    let images: { deteriorationSrc: string; originalSrc: string; width: number; height: number; }[] = [];
    // フォルダに応じた画像データを取得
    if (folder === "public") {
        images = publicImages;
    }
    else if (folder === "public2") {
        images = public2Images;
    }

    return (
        <div>
            {/* メニューバー */}
            <div className="flex space-x-4 mb-4">
                <a href="/public">
                    <button 
                        className={`px-4 py-2 ${folder === "public" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        Public
                    </button>
                </a>
                <a href="/public2">
                    <button 
                        className={`px-4 py-2 ${folder === "public2" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        Public2
                    </button>
                </a>
            </div>

            {/* 画像表示 */}
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
        </div>
    );
}
