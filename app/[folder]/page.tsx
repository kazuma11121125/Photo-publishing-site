import Home from "../page";

export default function FolderPage({ params }: { params: { folder: string } }) {
    return <Home params={params} />;
}
