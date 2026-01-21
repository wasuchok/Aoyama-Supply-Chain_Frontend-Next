"use client"

import { ScrollableTable } from "@/app/components/survey/table/ScrollableTable";
import { usePagination } from "@/app/hooks/usePagination";
import { apiPublic } from "@/services/httpClient";
import { fetchPartLevels } from "@/services/partLevels";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { IconType } from "react-icons";
import { FaCartShopping, FaNetworkWired } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { IoIosPeople } from "react-icons/io";
import Select, { type StylesConfig } from "react-select";

type LevelFilterOverrides = Partial<{ large: string; medium: string; small: string; production_by: string; search: string }>;
type SelectOption = { value: string; label: string };

const toSelectOptions = (values: string[]): SelectOption[] => values.map((value) => ({ value, label: value }));
const productionByOptions = toSelectOptions(["ATC", "Supplier", "Aoyama"]);

const selectStyles: StylesConfig<SelectOption, false> = {
    control: (base, state) => ({
        ...base,
        borderRadius: "0.75rem",
        borderColor: state.isFocused ? "#1f4b99" : "#d7e2f3",
        boxShadow: state.isFocused ? "0 0 0 1px #2c5fb8" : "none",
        ":hover": {
            borderColor: "#1f4b99",
        },
        minHeight: "40px",
        backgroundColor: state.isDisabled ? "#e9f0fb" : "#f8fbff",
        fontSize: "0.875rem",
    }),
    valueContainer: (base) => ({
        ...base,
        padding: "2px 12px",
    }),
    placeholder: (base) => ({
        ...base,
        color: "#7b8aa6",
    }),
    singleValue: (base) => ({
        ...base,
        color: "#1f2a37",
        fontWeight: 500,
    }),
    menu: (base) => ({
        ...base,
        borderRadius: "0.75rem",
        overflow: "hidden",
        fontSize: "0.875rem",
        backgroundColor: "#f8fbff",
        border: "1px solid #d7e2f3",
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? "#1f4b99" : state.isFocused ? "#e5eefb" : "#f8fbff",
        color: state.isSelected ? "#ffffff" : "#0f172a",
        cursor: state.isDisabled ? "not-allowed" : "pointer",
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base, state) => ({
        ...base,
        color: state.isFocused ? "#1f4b99" : "#7b8aa6",
        ":hover": { color: "#1f4b99" },
    }),
};

const DashboardContent = () => {
    const router = useRouter()
    const {
        data,
        pagination,
        page,
        loading,
        searchTerm,
        setSearchTerm,
        fetchData
    } = usePagination(`/spc-part-master`);
    const [metrics, setMetrics] = useState<
        { label: string; value: number; icon: IconType; iconColor: string; color: string }[]
    >([]);
    const [largeOptions, setLargeOptions] = useState<string[]>([]);
    const [mediumOptions, setMediumOptions] = useState<string[]>([]);
    const [smallOptions, setSmallOptions] = useState<string[]>([]);
    const [selectedLarge, setSelectedLarge] = useState("");
    const [selectedMedium, setSelectedMedium] = useState("");
    const [selectedSmall, setSelectedSmall] = useState("");
    const [selectedProduction, setSelectedProduction] = useState("");
    const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
    const largeSelectOptions = useMemo(() => toSelectOptions(largeOptions), [largeOptions]);
    const mediumSelectOptions = useMemo(() => toSelectOptions(mediumOptions), [mediumOptions]);
    const smallSelectOptions = useMemo(() => toSelectOptions(smallOptions), [smallOptions]);
    const selectedLargeOption = useMemo<SelectOption | null>(() => (selectedLarge ? { value: selectedLarge, label: selectedLarge } : null), [selectedLarge]);
    const selectedMediumOption = useMemo<SelectOption | null>(() => (selectedMedium ? { value: selectedMedium, label: selectedMedium } : null), [selectedMedium]);
    const selectedSmallOption = useMemo<SelectOption | null>(() => (selectedSmall ? { value: selectedSmall, label: selectedSmall } : null), [selectedSmall]);
    const selectedProductionOption = useMemo<SelectOption | null>(
        () => (selectedProduction ? { value: selectedProduction, label: selectedProduction } : null),
        [selectedProduction]
    );


    const fetchAmountProductionBy = async () => {
        try {
            const { data, status } = await apiPublic.get(`/spc-part-master/statistics/production-by`)

            if (status == 200 || status == 201) {
                const result = data.resultData ?? [];


                const baseGroups = [
                    {
                        label: "ATC",
                        icon: IoIosPeople,
                        iconColor: "text-[#1f4b99]",
                        color: "#1f4b99",
                    },
                    {
                        label: "Supplier",
                        icon: FaCartShopping,
                        iconColor: "text-[#2c5fb8]",
                        color: "#2c5fb8",
                    },
                    {
                        label: "Aoyama group",
                        icon: FaNetworkWired,
                        iconColor: "text-[#3b74c5]",
                        color: "#3b74c5",
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
        {
            header: 'Product Type', accessor: 'product_type', render: (value: string, data: any) => {
                return (
                    <div>
                        {data.Large}/{data.Medium}/{data.Small}
                    </div>
                )
            }
        },
        { header: 'Production by', accessor: 'Production_By', },

    ];

    const buildFilters = (overrides?: LevelFilterOverrides) => {
        const largeValue = overrides?.large ?? selectedLarge;
        const mediumValue = overrides?.medium ?? selectedMedium;
        const smallValue = overrides?.small ?? selectedSmall;
        const productionValue = overrides?.production_by ?? selectedProduction;
        const searchValue = overrides?.search !== undefined ? overrides.search : appliedSearchTerm;

        const normalizedLarge = largeValue?.trim() ?? "";
        const normalizedMedium = mediumValue?.trim() ?? "";
        const normalizedSmall = smallValue?.trim() ?? "";
        const normalizedProduction = productionValue?.trim() ?? "";
        const normalizedSearch = searchValue?.trim() ?? "";

        return {
            search: normalizedSearch || undefined,
            large: normalizedLarge || undefined,
            medium: normalizedMedium || undefined,
            small: normalizedSmall || undefined,
            production_by: normalizedProduction || undefined,
        };
    };

    const refetchWithFilters = (pageNumber = 1, overrides?: LevelFilterOverrides) => {
        return fetchData(pageNumber, buildFilters(overrides));
    };

    const handleLargeChange = async (value?: string | null) => {
        const normalizedValue = typeof value === "string" ? value.trim() : "";
        setSelectedLarge(normalizedValue);
        setSelectedMedium("");
        setSelectedSmall("");
        setMediumOptions([]);
        setSmallOptions([]);

        if (normalizedValue) {
            try {
                const response = await fetchPartLevels({ large: normalizedValue });
                setMediumOptions(response.resultData ?? []);
            } catch (error) {
                console.log("Error fetching medium levels: ", error);
            }
        }

        refetchWithFilters(1, { large: normalizedValue, medium: "", small: "" });
    };

    const handleMediumChange = async (value?: string | null) => {
        const normalizedValue = typeof value === "string" ? value.trim() : "";
        setSelectedMedium(normalizedValue);
        setSelectedSmall("");
        setSmallOptions([]);

        if (normalizedValue && selectedLarge) {
            try {
                const response = await fetchPartLevels({
                    large: selectedLarge,
                    medium: normalizedValue,
                });
                setSmallOptions(response.resultData ?? []);
            } catch (error) {
                console.log("Error fetching small levels: ", error);
            }
        }

        refetchWithFilters(1, { medium: normalizedValue, small: "" });
    };

    const handleSmallChange = (value?: string | null) => {
        const normalizedValue = typeof value === "string" ? value.trim() : "";
        setSelectedSmall(normalizedValue);
        refetchWithFilters(1, { small: normalizedValue });
    };

    const handleProductionChange = (value?: string | null) => {
        const normalizedValue = typeof value === "string" ? value.trim() : "";
        setSelectedProduction(normalizedValue);
        refetchWithFilters(1, { production_by: normalizedValue });
    };

    useEffect(() => {
        fetchAmountProductionBy()
    }, [])

    useEffect(() => {
        const fetchLargeLevels = async () => {
            try {
                const response = await fetchPartLevels();
                setLargeOptions(response.resultData ?? []);
            } catch (error) {
                console.log("Error fetching large levels: ", error);
            }
        };

        fetchLargeLevels();
    }, []);

    const handleSearch = () => {
        const normalizedValue = searchTerm.trim();
        setAppliedSearchTerm(normalizedValue);
        refetchWithFilters(1, { search: normalizedValue });
    };




    return (
        <main className="flex-1 overflow-y-auto bg-[#f3f6fb] p-4">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
                    <section className="relative flex-1 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1f4b99] via-[#2c5fb8] to-[#3b74c5] p-6 text-white shadow-lg">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full bg-white/25 blur-3xl" />
                            <div className="absolute -bottom-20 left-8 h-32 w-32 rounded-full bg-cyan-300/40 blur-3xl" />
                            <svg className="absolute inset-x-0 bottom-0 w-full" height="120" preserveAspectRatio="none" viewBox="0 0 1440 320" aria-hidden="true">
                                <path fill="url(#waveGradient)" fillOpacity="0.25" d="M0,256L48,234.7C96,213,192,171,288,165.3C384,160,480,192,576,197.3C672,203,768,181,864,192C960,203,1056,245,1152,245.3C1248,245,1344,203,1392,181.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                                <defs>
                                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
                                        <stop offset="100%" stopColor="#9ddcff" stopOpacity="0.4" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="relative flex flex-col gap-5">
                            <div className="flex flex-wrap items-end justify-between gap-4">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">Overview</p>
                                    <h1 className="text-2xl font-semibold text-white">Supply Chain Information</h1>
                                    <p className="mt-1 text-sm text-white/80">
                                        Quick snapshot of part volume and partner status so the team sees everything at a glance.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/30 bg-white/15 px-4 py-2 text-right shadow-inner">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Total parts</p>
                                    <p className="text-3xl font-bold text-white">{totalParts.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                                {metrics.map((metric) => {
                                    const Icon = metric.icon;
                                    return (
                                        <div
                                            key={metric.label}
                                            className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm transition hover:bg-white/20"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-white/70">{metric.label}</p>
                                                    <p className="text-2xl font-bold text-white">{metric.value.toLocaleString()}</p>
                                                </div>
                                                <div className="rounded-xl bg-white/20 p-3 shadow-lg shadow-black/10">
                                                    <span className={`text-xl ${metric.iconColor}`}>
                                                        <Icon />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    <SummaryPieChart data={metrics} />
                </div>



                <div className="flex flex-col rounded-2xl border border-[#d7e2f3] bg-[#f8fbff] p-4 shadow-sm lg:h-[calc(100vh-300px)]">

                    {loading && <p className="text-sm text-[#5b6b86]">Loading data...</p>}

                    <div className="grid w-full gap-3 md:grid-cols-4 z-20">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="filter-large" className="text-xs font-semibold uppercase tracking-wide text-[#5b6b86]">Large</label>
                            <Select<SelectOption, false>
                                inputId="filter-large"
                                isClearable
                                options={largeSelectOptions}
                                value={selectedLargeOption}
                                onChange={(option) => handleLargeChange(option?.value)}
                                placeholder="All Large"
                                classNamePrefix="rs"
                                styles={selectStyles}
                                isDisabled={largeSelectOptions.length === 0}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="filter-medium" className="text-xs font-semibold uppercase tracking-wide text-[#5b6b86]">Medium</label>
                            <Select<SelectOption, false>
                                inputId="filter-medium"
                                isClearable
                                options={mediumSelectOptions}
                                value={selectedMediumOption}
                                onChange={(option) => handleMediumChange(option?.value)}
                                placeholder="All Medium"
                                classNamePrefix="rs"
                                styles={selectStyles}
                                isDisabled={!selectedLarge || mediumSelectOptions.length === 0}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="filter-small" className="text-xs font-semibold uppercase tracking-wide text-[#5b6b86]">Small</label>
                            <Select<SelectOption, false>
                                inputId="filter-small"
                                isClearable
                                options={smallSelectOptions}
                                value={selectedSmallOption}
                                onChange={(option) => handleSmallChange(option?.value)}
                                placeholder="All Small"
                                classNamePrefix="rs"
                                styles={selectStyles}
                                isDisabled={!selectedMedium || smallSelectOptions.length === 0}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="filter-production" className="text-xs font-semibold uppercase tracking-wide text-[#5b6b86]">Production by</label>
                            <Select<SelectOption, false>
                                inputId="filter-production"
                                isClearable
                                options={productionByOptions}
                                value={selectedProductionOption}
                                onChange={(option) => handleProductionChange(option?.value)}
                                placeholder="All sources"
                                classNamePrefix="rs"
                                styles={selectStyles}
                            />
                        </div>
                    </div>



                    <div className="mt-2 flex items-center w-full max-w-md bg-[#e9f0fb] border border-[#d7e2f3] rounded-xl px-2 py-1.5 focus-within:ring-2 focus-within:ring-[#2c5fb8] transition">
                        <FiSearch className="text-[#7b8aa6] ml-1" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSearch();
                                }
                            }}
                            placeholder="Search for part name, material, or supplier..."
                            className="flex-1 bg-transparent px-3 py-1.5 text-sm text-slate-700 outline-none placeholder:text-[#7b8aa6]"
                        />
                        <button
                            onClick={handleSearch}
                            type="button"
                            className="rounded-lg bg-[#1f4b99] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#163a6b] transition-colors"
                        >
                            Search
                        </button>
                    </div>



                    <div className="flex-1 min-h-0 pt-3">
                        <ScrollableTable
                            columns={columns}
                            data={data}
                            loading={loading}
                            className="h-full border-0 shadow-none"
                            height="100%"
                            onEdit={(data) => {

                                router.push(`/survey/detail/${data.Part_No}`);
                            }}
                            currentPage={page}
                            totalPages={pagination?.total_pages || 1}
                            onPageChange={(newPage) => refetchWithFilters(newPage)}
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
        : { backgroundColor: "#dbe7f8" };

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



    return (
        <div className="w-full rounded-2xl border border-[#d7e2f3] bg-[#f8fbff] p-6 shadow-sm lg:max-w-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#5b6b86]">Distribution</p>
                    <p className="text-lg font-bold text-slate-900">Parts overview</p>
                </div>
                <div className="rounded-full border border-[#d7e2f3] px-3 py-1 text-xs font-medium text-[#5b6b86]">
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
                    <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-[#f8fbff] text-center">
                        <span className="text-xs font-semibold uppercase text-[#5b6b86]">{displaySlice.label}</span>
                        <span className="text-2xl font-bold text-slate-900">{displaySlice.value.toLocaleString()}</span>
                        <span className="text-[10px] text-[#7b8aa6]">parts</span>
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


