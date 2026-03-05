import { getAPIUrl } from "@/lib/utils";
import Button from "@/components/utils/Button";
import DownloadIcon from "@/components/icons/DownloadIcon";

export default function DownloadStructureButton({ identifierId, structureLevelId }: { identifierId: number, structureLevelId: number }) {
    return (
        <Button
            variant="secondary"
            size="xs"
            className="text-slate-500 hover:text-slate-300 px-1.5"
            title={`Stáhnout JSON data`}
            onClick={() => window.open(getAPIUrl(`stats/data/export/structure/${identifierId}/json?structureLevelId=${structureLevelId}`), "_blank")}
        >
            <DownloadIcon className="w-3.5 h-3.5" />
        </Button>
    );
}