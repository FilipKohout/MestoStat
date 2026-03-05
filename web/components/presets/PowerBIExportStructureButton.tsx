import { getAPIUrl } from "@/lib/utils";
import Button from "@/components/utils/Button";
import DownloadIcon from "@/components/icons/DownloadIcon";

export default function PowerBIExportStructureButton({ identifierId, structureLevelId }: { identifierId: number, structureLevelId: number }) {

    const handleDownload = () => {
        const queryUrl = getAPIUrl(`stats/data/export/structure/${identifierId}/sheet?structureLevelId=${structureLevelId}`);
        const pbidsContent = {
            version: "0.1",
            connections: [
                {
                    details: {
                        protocol: "http",
                        address: {
                            url: queryUrl
                        }
                    },
                    options: {},
                    mode: "Import"
                }
            ]
        };

        const blob = new Blob([JSON.stringify(pbidsContent, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `ID${identifierId}_ST${structureLevelId}_Mestostat.pbids`;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Button
            variant="secondary"
            size="xs"
            className="text-slate-500 hover:text-slate-300 px-1.5"
            title="Stáhnout jako Power BI template"
            onClick={handleDownload}
        >
            <img src="/PowerBI.png" alt="Power BI Icon" className="min-w-3.5 h-3.5" />
        </Button>
    );
}