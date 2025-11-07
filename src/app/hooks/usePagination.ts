"use client";
import { publicApi } from "@/services/apiPublic";
import { PaginationInfo } from "@/types/pagination";
import { useEffect, useState } from "react";

export function usePagination(apiPath: string, pageSize = 10) {
    const [data, setData] = useState<any[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const fetchData = async (newPage = 1, search?: string) => {
        try {
            setLoading(true);


            const queryParams = new URLSearchParams({
                page: newPage.toString(),
                page_size: pageSize.toString(),
            });

            if (search && search.trim() !== "") {
                queryParams.append("search", search.trim());
            }

            const res = await publicApi.get<{
                resultData: any[];
                pagination: PaginationInfo;
            }>(`${apiPath}?${queryParams.toString()}`);

            const dataWithNo = res.resultData.map((item, index) => ({
                no: (newPage - 1) * pageSize + (index + 1),
                ...item,
            }));

            setData(dataWithNo);
            setPagination(res.pagination);
            setPage(newPage);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(1);
    }, [apiPath]);

    return {
        data,
        pagination,
        page,
        loading,
        searchTerm,
        setSearchTerm,
        fetchData,
    };
}
