import fs from "fs";
import path from "path";
import Home from "../page";

export default Home;

export async function generateStaticParams() {
    const publicPath = path.join(process.cwd(), "public");
    const folders = fs.readdirSync(publicPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => ({ folder: dirent.name }));

    return folders;
}
