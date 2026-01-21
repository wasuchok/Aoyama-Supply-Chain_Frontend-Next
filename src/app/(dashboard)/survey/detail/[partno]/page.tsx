"use client"

import TextField from "@/app/components/Input/TextField"
import ButtonTierGroup from "@/app/components/survey/detail/ButtonTierGroup"
import { apiPublic } from "@/services/httpClient"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { Controller, useForm } from "react-hook-form"
import { FiArrowLeft, FiDownload } from "react-icons/fi"

interface DetailItemProps {
    label: string
    value?: ReactNode
}

const DetailItem = ({ label, value }: DetailItemProps) => (
    <div className="rounded-xl border border-[#d7e2f3] bg-[#e9f0fb] px-4 py-3 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#5b6b86]">{label}</p>
        <p className="mt-1 text-sm font-medium text-slate-900 break-words">{value ?? "-"}</p>
    </div>
)

const Page = () => {
    const { partno } = useParams()
    const router = useRouter()
    const [partMaster, setPartMaster] = useState<any>(null)
    const [tierLength, setTierLength] = useState<number>(0)
    const [activeIndex, setActiveIndex] = useState(0)
    const [partInformation, setPartInformation] = useState<any>([])
    const isReadOnly = true;
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            supplierName: "",
            industrialEstate: "",
            country: "",
            province: "",
            city: "",
            p_chainProcess: "",
            p_MaterialName: "",
            p_Diameter: "",
            p_stdStock: "",
            d_supplierName: "",
            d_country: "",
            d_province: "",
            d_city: "",
            pd_supplierName: "",
            pd_country: "",
            pd_province: "",
            pd_city: "",
        },
    });

    useEffect(() => {
        const fetchSpcPartMasterDetail = async () => {
            try {
                const { data, status } = await apiPublic.get(`/spc-part-master/${partno}`);
                if (status === 200 || status === 201) {
                    console.log("✅ API Response:", data);
                    setPartMaster(data.resultData.PartMaster);
                    setTierLength(data.resultData.PartInformation.length || 1);
                    setPartInformation(data.resultData.PartInformation);
                }
            } catch (error) {
                console.log("Error fetch data: ", error);
            }
        };

        if (partno) fetchSpcPartMasterDetail();
    }, [partno]);

    useEffect(() => {
        if (!partInformation.length) return;

        const info = partInformation.find(
            (item: any) => item.Tier_No === activeIndex + 1
        );

        if (info) {
            reset({
                supplierName: info.Sup_Name || "",
                industrialEstate: info.Inductrial_Estate || "",
                country: info.Country || "",
                province: info.Province || "",
                city: info.District || "",
                p_chainProcess: info.Chain_Process || "",
                p_MaterialName: info.C_mat_name || "",
                p_Diameter: info.c_diameter || "",
                p_stdStock: info.Std_Stock || "",
                d_supplierName: info.d_sup_name || "",
                d_country: info.d_country || "",
                d_province: info.d_province || "",
                d_city: info.d_district || "",
                pd_supplierName: info.p_sup_name || "",
                pd_country: info.p_country || "",
                pd_province: info.p_province || "",
                pd_city: info.p_district || "",
            });
        } else {
            reset({
                supplierName: "",
                industrialEstate: "",
                country: "",
                province: "",
                city: "",
                p_chainProcess: "",
                p_MaterialName: "",
                p_Diameter: "",
                p_stdStock: "",
                d_supplierName: "",
                d_country: "",
                d_province: "",
                d_city: "",
                pd_supplierName: "",
                pd_country: "",
                pd_province: "",
                pd_city: "",
            });
        }
    }, [activeIndex, partInformation, reset]);

    const handleExportExcel = () => {
        if (!partMaster) return;

        const info = partInformation.find(
            (item: any) => item.Tier_No === activeIndex + 1
        ) ?? {};

        const rows: Array<[string, string | number | null | undefined]> = [
            ["ATC Part no.", partMaster?.Part_No],
            ["Part name", partMaster?.Part_Name],
            ["Material name", partMaster?.Mat_Name],
            ["Diameter", partMaster?.Diameter],
            ["Product type", [partMaster?.Large, partMaster?.Medium, partMaster?.Small].filter(Boolean).join(" / ")],
            ["Size", partMaster?.M_Size],
            ["Surface", partMaster?.Surface],
            ["Production by", partMaster?.Production_By],
            ["Tier No.", info?.Tier_No ?? activeIndex + 1],
            ["Supplier Name", info?.Sup_Name],
            ["Industrial Estate", info?.Inductrial_Estate],
            ["Country", info?.Country],
            ["Province", info?.Province],
            ["City", info?.District],
            ["Chain Process", info?.Chain_Process],
            ["Material name (production)", info?.C_mat_name],
            ["Diameter (production)", info?.c_diameter],
            ["Std. Stock (days)", info?.Std_Stock],
            ["Dual source supplier", info?.d_sup_name],
            ["Dual source country", info?.d_country],
            ["Dual source province", info?.d_province],
            ["Dual source city", info?.d_district],
            ["PD replacement supplier", info?.p_sup_name],
            ["PD replacement country", info?.p_country],
            ["PD replacement province", info?.p_province],
            ["PD replacement city", info?.p_district],
        ];

        const formatCsvValue = (value: string | number | null | undefined) => {
            const normalized = value === null || value === undefined || value === "" ? "-" : String(value);
            return `"${normalized.replace(/"/g, '""')}"`;
        };

        const csvContent = [
            "Field,Value",
            ...rows.map(([label, value]) => `${formatCsvValue(label)},${formatCsvValue(value)}`),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `part-${partMaster?.Part_No ?? "detail"}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };



    return (
        <>
            <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#f3f6fb] via-[#f1f5fb] to-[#e9f0fb] p-4 text-slate-700">
                <div className="flex flex-col gap-4 mx-auto w-full max-w-7xl">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#d7e2f3] bg-[#e9f0fb] px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#e5eefb]"
                        >
                            <FiArrowLeft className="h-4 w-4" />
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleExportExcel}
                            disabled={!partMaster}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#217346] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b5e37] disabled:cursor-not-allowed disabled:bg-[#9cc7ad]"
                        >
                            <FiDownload className="h-4 w-4" />
                            Export Excel
                        </button>
                    </div>

                    <div className="bg-[#f8fbff] p-6 rounded-2xl border border-[#d7e2f3] shadow-sm flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#5b6b86]">ATC Part no.</p>
                            <p className="text-2xl font-bold text-slate-900">{partMaster?.Part_No ?? '-'}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                            <DetailItem label="Part name" value={partMaster?.Part_Name} />
                            <DetailItem label="Material name" value={partMaster?.Mat_Name} />
                            <DetailItem label="Diameter" value={partMaster?.Diameter} />
                            <DetailItem
                                label="Product type"
                                value={[partMaster?.Large, partMaster?.Medium, partMaster?.Small].filter(Boolean).join(' / ') || '-'}
                            />
                            <DetailItem label="Size" value={partMaster?.M_Size} />
                            <DetailItem label="Surface" value={partMaster?.Surface} />
                            <DetailItem label="Production by" value={partMaster?.Production_By} />
                        </div>
                    </div>

                    <ButtonTierGroup tierLength={tierLength} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />



                    <div className="relative overflow-hidden bg-[#f8fbff] p-6 rounded-2xl border border-[#d7e2f3] shadow-sm flex flex-col gap-2">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1f4b99] via-[#2c5fb8] to-[#3b74c5]" />
                        <div className="text-lg font-semibold mb-3 text-slate-900">
                            SUPPLIER INFORMATION
                        </div>

                        <Controller
                            name="supplierName"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    readOnly={isReadOnly}
                                    label="Supplier Name"
                                    placeholder="Please fill in information..."
                                    {...field}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        <Controller
                            name="industrialEstate"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    readOnly={isReadOnly}
                                    label="Industrial Estate"
                                    placeholder="Please fill in information..."
                                    {...field}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        <Controller
                            name="country"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    readOnly={isReadOnly}
                                    label="Country"
                                    placeholder="Please fill in information..."
                                    {...field}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        <Controller
                            name="province"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    readOnly={isReadOnly}
                                    label="Province"
                                    placeholder="Please fill in information..."
                                    {...field}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        <Controller
                            name="city"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    readOnly={isReadOnly}
                                    label="City"
                                    placeholder="Please fill in information..."
                                    {...field}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                    </div>

                    <div className="relative overflow-hidden bg-[#f8fbff] p-6 rounded-2xl border border-[#d7e2f3] shadow-sm flex flex-col gap-2">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2c5fb8] via-[#4a78c8] to-[#6a92d8]" />
                        <div className="text-lg font-semibold mb-3 text-slate-900">
                            PRODUCTION INFORMATION
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">


                            <Controller
                                name="p_chainProcess"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        readOnly={isReadOnly}
                                        label="Chain Process"
                                        placeholder="Please fill in information..."
                                        {...field}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="p_MaterialName"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        readOnly={isReadOnly}
                                        label="Material name"
                                        placeholder="Please fill in information..."
                                        {...field}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="p_Diameter"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        readOnly={isReadOnly}
                                        label="Diameter"
                                        placeholder="Please fill in information..."
                                        {...field}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="p_stdStock"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        readOnly={isReadOnly}
                                        label="Std. Stock (days)"
                                        placeholder="Please fill in information..."
                                        {...field}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />

                        </div>
                    </div>

                    <div className="relative overflow-hidden bg-[#f8fbff] p-6 rounded-2xl border border-[#d7e2f3] shadow-sm flex flex-col gap-2">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#163a6b] via-[#1f4b99] to-[#2c5fb8]" />
                        <div className="text-lg font-semibold mb-3 text-slate-900">
                            BACK UP CONDITION
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2 border-r border-dashed border-[#d7e2f3] pr-4">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wide text-[#5b6b86]">Dual Source</p>
                                    <Controller
                                        name="d_supplierName"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                readOnly={isReadOnly}
                                                label="Supplier name"
                                                placeholder="Please fill in information..."
                                                {...field}
                                                error={fieldState.error?.message}
                                            />
                                        )}
                                    />

                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                    <div>
                                        <Controller
                                            name="d_country"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <TextField
                                                    readOnly={isReadOnly}
                                                    label="Country"
                                                    placeholder="Please fill in information..."
                                                    {...field}
                                                    error={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <Controller
                                            name="d_province"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <TextField
                                                    readOnly={isReadOnly}
                                                    label="Province"
                                                    placeholder="Please fill in information..."
                                                    {...field}
                                                    error={fieldState.error?.message}
                                                />
                                            )}
                                        />

                                    </div>

                                    <div>
                                        <Controller
                                            name="d_city"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <TextField
                                                    readOnly={isReadOnly}
                                                    label="City"
                                                    placeholder="Please fill in information..."
                                                    {...field}
                                                    error={fieldState.error?.message}
                                                />
                                            )}
                                        />

                                    </div>
                                </div>
                            </div>

                            <div className="w-1/2 pl-4">
                                <p className="text-sm font-semibold uppercase tracking-wide text-[#5b6b86]">PD Replacement</p>
                                <Controller
                                    name="pd_supplierName"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            readOnly={isReadOnly}
                                            label="Supplier name"
                                            placeholder="Please fill in information..."
                                            {...field}
                                            error={fieldState.error?.message}
                                        />
                                    )}
                                />


                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                    <div>
                                        <Controller
                                            name="pd_country"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <TextField
                                                    readOnly={isReadOnly}
                                                    label="Country"
                                                    placeholder="Please fill in information..."
                                                    {...field}
                                                    error={fieldState.error?.message}
                                                />
                                            )}
                                        />

                                    </div>

                                    <div>
                                        <Controller
                                            name="pd_province"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <TextField
                                                    readOnly={isReadOnly}
                                                    label="Province"
                                                    placeholder="Please fill in information..."
                                                    {...field}
                                                    error={fieldState.error?.message}
                                                />
                                            )}
                                        />

                                    </div>

                                    <div>
                                        <Controller
                                            name="pd_city"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <TextField
                                                    readOnly={isReadOnly}
                                                    label="City"
                                                    placeholder="Please fill in information..."
                                                    {...field}
                                                    error={fieldState.error?.message}
                                                />
                                            )}
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </main >
        </>
    )
}

export default Page
