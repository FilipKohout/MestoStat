"use client";

import { DashboardCard, DashboardCardProps } from "@/app/components/utils/DashboardCard";
import Dropdown from "@/app/components/utils/Dropdown";
import Button from "@/app/components/utils/Button";
import DatabaseIcon from "@/app/components/icons/DatabaseIcon";
import { useEffect, useMemo, useState } from "react";
import useTableData from "@/app/hooks/charts/query/useTableData";
import { TableDataParams } from "@/app/services/charts/tableData";
import { getCategoryColorHex } from "@/app/lib/utils";
import { CHART_INDEX_KEY as INDEX_KEY } from "@/app/lib/consts";
import useTableMetadata from "@/app/hooks/charts/query/useTableMetadata";

export type ChartDataItem = {
    [INDEX_KEY]: string;
    [key: string]: number | string;
}

export type ChartProps = {
    data: never[];
    activeCategories: string[];
    allCategories: string[];
    valueFormatter: (value: number, ...rest: never[] ) => string;
    addTotalCategory?: boolean;
}

type ChartVariant = {
    tableId: number;
    label: string;
    component: React.ComponentType<ChartProps>;
    valueFormatter: (value: number, ...rest: never[] ) => string;
    addTotalCategory?: boolean;
};

type ChartWrapperProps = {
    title: string;
    variants: ChartVariant[];
    showFilters: boolean;
    className?: string;
    
    startDate: Date,
    endDate: Date,
    identifierId: number;
    periodicityId: number;
    structureLevelId: number;
} & DashboardCardProps;

export function ChartWrapper(props: ChartWrapperProps) {
    const { title, variants, showFilters, className = "" } = props;

    const [activeCategories, setActiveCategories] = useState<string[]>([]);
    const [variantId, setVariantId] = useState(0);

    const selectedVariant = variants[variantId];
    const selectedTableId = selectedVariant.tableId;

    const { metadata } = useTableMetadata(selectedTableId);
    const { data, isLoading, isError } = useTableData({
        tableId: selectedTableId,
        startDate: props.startDate,
        endDate: props.endDate,
        identifierId: props.identifierId,
        periodicityId: props.periodicityId,
        structureLevelId: props.structureLevelId,
    } as TableDataParams);

    const categories = useMemo(() => {
        if (!data || data.length === 0) return [];
        
        const newCategories = Object.keys(data[0]).filter(key => key !== INDEX_KEY);
        
        if (selectedVariant.addTotalCategory && !newCategories.includes("total"))
            newCategories.unshift("total");

        return newCategories;
    }, [data, selectedVariant.addTotalCategory]);

    const onVariantChange = (value: number | string) => {
        setVariantId(value as number);
    };

    const toggleCategory = (category: string) =>
        setActiveCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
    );

    useEffect(() => {
        setActiveCategories(categories);
    }, [categories]);

    const lastYear = data && data.length > 0
        ? new Date(data[data.length - 1][INDEX_KEY]).getFullYear()
        : new Date().getFullYear();

    return (
        <DashboardCard variant="default" {...props} className={"overflow-visible " + className}>
            <DashboardCard.Header
                title={title}
                action={
                    <Button
                        variant="ghost"
                        size="xs"
                        className="text-slate-500 hover:text-slate-300 px-1.5"
                        title={`Zdroj dat: ${metadata?.sourceDomain || 'N/A'}`}
                        onClick={() => window.open(metadata?.sourceDomain, "_blank")}
                    >
                        <DatabaseIcon className="w-3.5 h-3.5" />
                    </Button>
                }
            >
                {variants.length > 1 && (
                    <Dropdown
                        options={variants.map((v, i) => ({ label: v.label.replace("%year", lastYear.toString()), value: i }))}
                        value={variantId}
                        onChange={onVariantChange}
                    />
                )}
            </DashboardCard.Header>

            <DashboardCard.Content isLoading={isLoading} isError={isError}>
                <selectedVariant.component data={data as never[]} activeCategories={activeCategories} allCategories={categories} {...selectedVariant}  />
            </DashboardCard.Content>

            {showFilters &&
                <DashboardCard.Footer>
                    {categories.map((category) => {
                        const isActive = activeCategories.includes(category);
                        const hexColor = getCategoryColorHex(categories, category);

                        return (
                            <Button
                                key={category}
                                onClick={() => toggleCategory(category)}
                                variant={isActive ? "active" : "ghost"}
                                size="xs"
                            >
                            <span
                                className="h-2 w-2 rounded-full transition-all duration-300"
                                style={{
                                    backgroundColor: isActive ? hexColor : '#475569',
                                    boxShadow: isActive ? `0 0 8px ${hexColor}80` : 'none'
                                }}
                            />
                                {category === "total" ? "celkem" : category}
                            </Button>
                        );
                    })}
                </DashboardCard.Footer>
            }
        </DashboardCard>
    );
}