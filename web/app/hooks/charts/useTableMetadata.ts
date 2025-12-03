import { useQuery } from "@tanstack/react-query";
import { getAllTablesMetadata } from "@/app/services/charts/tableMetadata";
import { useMemo } from "react";
import useAllTablesMetadata from "@/app/hooks/charts/useAllTablesMetadata";

export default function useTableMetadata(tableId: number) {
    const { data: allMetadata } = useAllTablesMetadata();

    const metadata = useMemo(() => {
        if (!allMetadata) return null;
        return allMetadata.find(meta => meta.tableId == tableId);
    }, [allMetadata, tableId]);

    return { metadata, allMetadata };
}