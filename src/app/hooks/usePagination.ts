"use client";
import { publicApi } from "@/services/apiPublic";
import { PaginationInfo } from "@/types/pagination";
import { useEffect, useState } from "react";





export function usePagination(apiPath: string, pageSize = 10) {
    const [data, setData] = useState<any[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchData = async (newPage = 1) => {
        try {
            setLoading(true);
            const res = await publicApi.get<{
                resultData: any[];
                pagination: PaginationInfo;
            }>(`${apiPath}?page=${newPage}&page_size=${pageSize}`);

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
        fetchData(page);
    }, []);

    return { data, pagination, page, loading, fetchData };
}
