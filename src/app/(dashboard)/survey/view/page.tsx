"use client"

import TextField from "@/app/components/Input/TextField";
import { ScrollableTable } from "@/app/components/survey/table/ScrollableTable";
import { usePagination } from "@/app/hooks/usePagination";
import { apiPublic } from "@/services/httpClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { FaCartShopping, FaNetworkWired } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";

const DashboardContent = () => {
    const router = useRouter()
    const { data, pagination, page, loading, fetchData } = usePagination(`/spc-part-master`);
    const [metrics, setMetrics] = useState<
        { label: string; value: number; icon: IconType; iconColor: string; color: string }[]
    >([]);

    const fetchAmountProductionBy = async () => {
        try {
            const { data, status } = await apiPublic.get(`/spc-part-master/statistics/production-by`)

            if (status == 200 || status == 201) {
                const result = data.resultData ?? [];


                const baseGroups = [
                    {
                        label: "ATC",
                        icon: IoIosPeople,
                        iconColor: "text-primary-600",
                        color: "#3b82f6",
                    },
                    {
                        label: "Supplier",
                        icon: FaCartShopping,
                        iconColor: "text-green-600",
                        color: "#22c55e",
                    },
                    {
                        label: "Aoyama group",
                        icon: FaNetworkWired,
                        iconColor: "text-pink-600",
                        color: "#ec4899",
                    },
                ];


                const mapped = baseGroups.map((group) => {
                    const found = result.find((item: any) => {

                        return (
                            item.Production_By === group.label ||
                            (group.label === "Aoyama group" && item.Production_By === "Aoyama")
                        );
                    });

                    return {
                        ...group,
                        value: found ? found.Amount : 0,
                    };
                });

                setMetrics(mapped);
            }
        } catch (error) {
            console.log("Error fetch data: ", error)
        }
    }

    const totalParts = metrics.reduce((sum, metric) => sum + metric.value, 0);

    const columns: any[] = [
        { header: 'No.', accessor: 'no' },
        { header: 'ATC Part no', accessor: 'Part_No' },
        { header: 'Part name', accessor: 'Part_Name', },
        { header: 'Material name', accessor: 'Mat_Name', width: '120px' },
        { header: 'Diameter', accessor: 'Diameter', },
        { header: 'Production by', accessor: 'Production_By', },

    ];

    useEffect(() => {
        fetchAmountProductionBy()
    }, [])




    return (
        <main className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
                    <section className="flex-1 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-400">Overview</p>
                                <h1 className="text-2xl font-semibold text-gray-900">Supply Chain Information</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Quick snapshot of part volume and partner status so the team sees everything at a glance.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-gray-50 px-4 py-2 text-right">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total parts</p>
                                <p className="text-3xl font-bold text-gray-900">{totalParts.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="mt-4 grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {metrics.map((metric) => {
                                const Icon = metric.icon;
                                return (
                                    <div
                                        key={metric.label}
                                        className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 transition hover:bg-white"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                                                <p className="text-2xl font-bold text-gray-900">{metric.value.toLocaleString()}</p>
                                            </div>
                                            <div className="rounded-xl bg-white p-3 shadow-sm">
                                                <span className={`text-xl ${metric.iconColor}`}>
                                                    <Icon />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <SummaryPieChart data={metrics} />
                </div>



                <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:h-[calc(100vh-300px)]">

                    {loading && <p className="text-sm text-gray-500">Loading data...</p>}

                    <TextField placeholder="Search..." className="sm:max-w-xs" />

                    <div className="flex-1 min-h-0 pt-3">
                        <ScrollableTable
                            columns={columns}
                            data={data}
                            loading={false}
                            className="h-full border-0 shadow-none"
                            height="100%"
                            onEdit={(data) => {

                                router.push(`/survey/detail/${data.Part_No}`);
                            }}
                            currentPage={page}
                            totalPages={pagination?.total_pages || 1}
                            onPageChange={(newPage) => fetchData(newPage)}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

type SummarySlice = { label: string; value: number; color: string };

const SummaryPieChart = ({ data }: { data: SummarySlice[] }) => {
    const [hoverSlice, setHoverSlice] = useState<SummarySlice | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
    const total = data.reduce((sum, slice) => sum + slice.value, 0);

    let cumulative = 0;
    const gradient = total
        ? data
            .map((slice) => {
                const start = (cumulative / total) * 100;
                cumulative += slice.value;
                const end = (cumulative / total) * 100;
                return `${slice.color} ${start}% ${end}%`;
            })
            .join(", ")
        : "";

    const chartStyle = total
        ? { background: `conic-gradient(${gradient})` }
        : { backgroundColor: "#e5e7eb" };

    const displaySlice = hoverSlice ?? { label: "Total", value: total, color: "#111827" };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!total) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = event.clientX - centerX;
        const dy = event.clientY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = Math.min(rect.width, rect.height) / 2;
        const innerRadius = radius * 0.45;

        if (distance < innerRadius || distance > radius) {
            setHoverSlice(null);
            setTooltipPos(null);
            return;
        }

        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const normalizedAngle = (angle + 360) % 360;

        let accumulator = 0;
        for (const slice of data) {
            const sliceAngle = (slice.value / total) * 360;
            if (normalizedAngle >= accumulator && normalizedAngle < accumulator + sliceAngle) {
                setHoverSlice(slice);
                setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
                return;
            }
            accumulator += sliceAngle;
        }

        setHoverSlice(null);
        setTooltipPos(null);
    };

    const clearHover = () => {
        setHoverSlice(null);
        setTooltipPos(null);
    };

    const legendButtonStyles = (isActive: boolean) =>
        `flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-300 ${isActive ? "border-primary-100 bg-primary-50 text-primary-900" : "border-gray-100 hover:border-gray-200"
        }`;

    return (
        <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:max-w-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Distribution</p>
                    <p className="text-lg font-bold text-gray-900">Parts overview</p>
                </div>
                <div className="rounded-full border border-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                    {total.toLocaleString()} total
                </div>
            </div>
            <div className="mx-auto mt-1 flex items-center justify-center">
                <div
                    className="relative h-40 w-40 cursor-pointer"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={clearHover}
                    role="img"
                    aria-label="Parts distribution pie chart"
                >
                    <div className="h-full w-full rounded-full transition-all duration-200" style={chartStyle}></div>
                    <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-white/95 text-center">
                        <span className="text-xs font-semibold uppercase text-gray-500">{displaySlice.label}</span>
                        <span className="text-2xl font-bold text-gray-900">{displaySlice.value.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400">parts</span>
                    </div>
                    {hoverSlice && tooltipPos && (
                        <div
                            className="pointer-events-none absolute rounded-lg bg-gray-900/90 px-3 py-1 text-xs font-medium text-white shadow-lg transition"
                            style={{ left: tooltipPos.x, top: tooltipPos.y - 12, transform: "translate(-50%, -100%)" }}
                        >
                            {hoverSlice.label}: {hoverSlice.value.toLocaleString()}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default DashboardContent


