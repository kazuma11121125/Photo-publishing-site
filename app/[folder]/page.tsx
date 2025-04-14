import fs from "fs";
import path from "path";
import Home from "../page";

export default function FolderPage({ params }: { params: { folder: string } }) {
    return <Home params={params} />;
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