'use client';

import React, { useState, useMemo } from "react";
import { Frame } from "@/app/components/utils/Frame";
import Button from "@/app/components/utils/Button";
import Dropdown from "@/app/components/utils/Dropdown"; // Předpokládám cestu k vašemu Dropdownu
import { cnTailwind } from "@/app/lib/utils";
import ChevronDownIcon from "@/app/components/icons/ChevronDownIcon";

export interface Column<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    align?: "left" | "right" | "center";
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    defaultSort?: { key: keyof T; direction: "asc" | "desc" };
    itemsPerPageOptions?: number[];
    className?: string;
}

export default function DataTable<T>({ data, columns, defaultSort, itemsPerPageOptions = [5, 10, 20, 50], className }: DataTableProps<T>) {
    const [sortConfig, setSortConfig] = useState(defaultSort || null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(itemsPerPageOptions[0]);

    const sortedData = useMemo(() => {
        if (!sortConfig) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key as keyof T];
            const bValue = b[sortConfig.key as keyof T];

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, currentPage, pageSize]);

    const handleSort = (key: string, sortable?: boolean) => {
        if (!sortable) return;

        let direction: "asc" | "desc" = "asc";
        if (sortConfig?.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key: key as keyof T, direction });
    };

    return (
        <div className={cnTailwind("space-y-4", className)}>
            <Frame variant="default" noPadding className="overflow-x-auto border-slate-800">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-800">
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                onClick={() => handleSort(String(col.key), col.sortable)}
                                className={cnTailwind(
                                    "px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider",
                                    col.sortable && "cursor-pointer hover:text-white transition-colors",
                                    col.align === "right" && "text-right",
                                    col.align === "center" && "text-center"
                                )}
                            >
                                <div className={cnTailwind(
                                    "flex items-center gap-2",
                                    col.align === "right" && "justify-end",
                                    col.align === "center" && "justify-center"
                                )}>
                                    {col.label}
                                    {col.sortable && sortConfig?.key === col.key && (
                                        <ChevronDownIcon
                                            className={cnTailwind(
                                                "w-3 h-3 transition-transform",
                                                sortConfig.direction === "asc" && "rotate-180"
                                            )}
                                        />
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                    {paginatedData.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                            {columns.map((col) => (
                                <td
                                    key={String(col.key)}
                                    className={cnTailwind(
                                        "px-4 py-3 text-sm text-slate-300",
                                        col.align === "right" && "text-right",
                                        col.align === "center" && "text-center"
                                    )}
                                >
                                    {col.render ? col.render(item) : String(item[col.key as keyof T] || '')}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Frame>

            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 text-nowrap">Řádků na stránku:</span>
                    <Dropdown
                        options={itemsPerPageOptions.map(opt => ({ value: opt, label: String(opt) }))}
                        value={pageSize}
                        onChange={(val) => {
                            setPageSize(Number(val));
                            setCurrentPage(1);
                        }}
                        className="w-20"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 mr-2">
                        Strana {currentPage} z {totalPages || 1}
                    </span>
                    <Button
                        variant="outline"
                        size="xs"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        Předchozí
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Další
                    </Button>
                </div>
            </div>
        </div>
    );
}