import { getAPIUrl } from "@/lib/utils";
import Button from "@/components/utils/Button";
import DownloadIcon from "@/components/icons/DownloadIcon";

export default function ExcelExportStructureButton({ identifierId, structureLevelId }: { identifierId: number, structureLevelId: number }) {

    const handleDownload = () => {
        const queryUrl = getAPIUrl(`stats/data/export/structure/${identifierId}/sheet?structureLevelId=${structureLevelId}`);

        const link = document.createElement("a");
        link.href = queryUrl;
        link.download = `ID${identifierId}_ST${structureLevelId}_Mestostat.pbids`;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
    };

    return (
        <Button
            variant="secondary"
            size="xs"
            className="text-slate-500 hover:text-slate-300 px-1.5"
            title="Stáhnout jako Excel sheet"
            onClick={handleDownload}
        >
            <img src="/excel.png" alt="Excel Icon" className="min-w-3.5 h-3.5" />
        </Button>
    );
}