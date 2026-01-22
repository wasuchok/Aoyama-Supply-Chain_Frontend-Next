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

    const handleExportExcel = async () => {
        if (!partMaster) return;

        try {
            const ExcelJSImport = await import("exceljs");
            const ExcelJS: any = ExcelJSImport.default ?? ExcelJSImport;
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Supply Chain Management", {
                properties: { defaultRowHeight: 18 },
            });

            const sortedTiers = [...partInformation].sort(
                (a, b) => (a?.Tier_No ?? 0) - (b?.Tier_No ?? 0)
            );
            const tiers = sortedTiers.length ? sortedTiers : [{}];
            const mainTier = sortedTiers.find((tier: any) => tier?.Tier_No === 1) ?? tiers[0] ?? {};

            const desiredRows = Math.max(tiers.length, 1);

            const setCell = (col: string, rowNumber: number, value: any) => {
                worksheet.getCell(`${col}${rowNumber}`).value =
                    value === undefined || value === null || value === "" ? null : value;
            };

            const applyBorder = (cell: any) => {
                cell.border = {
                    top: { style: "thin", color: { argb: "D9E2EC" } },
                    left: { style: "thin", color: { argb: "D9E2EC" } },
                    bottom: { style: "thin", color: { argb: "D9E2EC" } },
                    right: { style: "thin", color: { argb: "D9E2EC" } },
                };
            };

            const yesIf = (value: any) => (value ? "Yes" : "No");

            worksheet.columns = [
                { width: 2 },  // A
                { width: 6 },  // B
                { width: 16 }, // C
                { width: 22 }, // D
                { width: 28 }, // E
                { width: 16 }, // F
                { width: 14 }, // G
                { width: 14 }, // H
                { width: 28 }, // I
                { width: 16 }, // J
                { width: 18 }, // K
                { width: 14 }, // L
                { width: 6 },  // M
                { width: 28 }, // N
                { width: 16 }, // O
                { width: 22 }, // P
                { width: 16 }, // Q
                { width: 14 }, // R
                { width: 14 }, // S
                { width: 28 }, // T
                { width: 16 }, // U
                { width: 18 }, // V
                { width: 14 }, // W
                { width: 2 },  // X
                { width: 28 }, // Y
                { width: 16 }, // Z
                { width: 14 }, // AA
                { width: 14 }, // AB
                { width: 28 }, // AC
                { width: 16 }, // AD
                { width: 14 }, // AE
                { width: 14 }, // AF
            ];

            worksheet.mergeCells("A1:AF1");
            setCell("A", 1, "Supply Chain Management");
            worksheet.getCell("A1").font = { bold: true, size: 16 };
            worksheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
            worksheet.getRow(1).height = 26;

            worksheet.mergeCells("B3:L5");
            worksheet.mergeCells("M3:W5");
            worksheet.mergeCells("Y3:AF5");
            setCell("B", 3, "1st Tier");
            setCell("M", 3, "Component / Material Information\n(Sub Tier)");
            setCell("Y", 3, "Back up Supplier");
            ["B3", "M3", "Y3"].forEach((cellAddress) => {
                const cell = worksheet.getCell(cellAddress);
                cell.font = { bold: true, size: 12 };
                cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
            });

            worksheet.mergeCells("B6:B8");
            worksheet.mergeCells("C6:C8");
            worksheet.mergeCells("D6:D8");
            worksheet.mergeCells("E6:E8");
            worksheet.mergeCells("F6:I6");
            worksheet.mergeCells("J6:K6");
            worksheet.mergeCells("L6:L8");
            worksheet.mergeCells("M6:M8");
            worksheet.mergeCells("N6:N8");
            worksheet.mergeCells("O6:O8");
            worksheet.mergeCells("P6:P8");
            worksheet.mergeCells("Q6:T6");
            worksheet.mergeCells("U6:V6");
            worksheet.mergeCells("W6:W8");
            worksheet.mergeCells("Y6:AB6");
            worksheet.mergeCells("AC6:AF6");
            worksheet.mergeCells("J7:J8");
            worksheet.mergeCells("K7:K8");
            worksheet.mergeCells("U7:U8");
            worksheet.mergeCells("V7:V8");
            worksheet.mergeCells("Y7:Y8");
            worksheet.mergeCells("Z7:AB7");
            worksheet.mergeCells("AC7:AC8");
            worksheet.mergeCells("AD7:AF7");

            setCell("B", 6, "No.");
            setCell("C", 6, "ATC NO.");
            setCell("D", 6, "Part Name");
            setCell("E", 6, "Supplier name");
            setCell("F", 6, "Location");
            setCell("J", 6, "Back up Condition");
            setCell("L", 6, "Standard Stock\n(days)");
            setCell("M", 6, "Tier");
            setCell("N", 6, "Supplier name");
            setCell("O", 6, "ATC Part No.");
            setCell("P", 6, "Part/Component name");
            setCell("Q", 6, "Location");
            setCell("U", 6, "Back up Condition");
            setCell("W", 6, "Standard Stock\n(days)");
            setCell("Y", 6, "Dual Source Supplier");
            setCell("AC", 6, "PD Replacement Supplier");

            setCell("F", 7, "Country");
            setCell("G", 7, "Province");
            setCell("H", 7, "City");
            setCell("I", 7, "Industrial Estate");
            setCell("J", 7, "Dual Source\n(Same Supplier)");
            setCell("K", 7, "PD Replacement\n(Diff. Supplier)");

            setCell("Q", 7, "Country");
            setCell("R", 7, "Province");
            setCell("S", 7, "City");
            setCell("T", 7, "Industrial Estate");
            setCell("U", 7, "Dual Source\n(Same Supplier)");
            setCell("V", 7, "PD Replacement\n(Diff. Supplier)");

            setCell("Y", 7, "Supplier Name");
            setCell("Z", 7, "Supplier Location");
            setCell("AC", 7, "Supplier Name");
            setCell("AD", 7, "Supplier Location");

            for (let row = 6; row <= 7; row += 1) {
                const worksheetRow = worksheet.getRow(row);
                worksheetRow.height = 26;
                for (let col = 2; col <= 32; col += 1) {
                    const cell = worksheet.getCell(row, col);
                    cell.font = { bold: true, size: 10 };
                    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "EAF2FB" },
                    };
                    applyBorder(cell);
                }
            }

            worksheet.views = [{ state: "frozen", ySplit: 8, xSplit: 1 }];

            const startRow = 9;
            const mainRow = startRow;
            setCell("B", mainRow, 1);
            setCell("C", mainRow, partMaster?.Part_No);
            setCell("D", mainRow, partMaster?.Part_Name);
            setCell("E", mainRow, mainTier?.Sup_Name);
            setCell("F", mainRow, mainTier?.Country);
            setCell("G", mainRow, mainTier?.Province);
            setCell("H", mainRow, mainTier?.District);
            setCell("I", mainRow, mainTier?.Inductrial_Estate);
            setCell("J", mainRow, yesIf(mainTier?.d_sup_name));
            setCell("K", mainRow, yesIf(mainTier?.p_sup_name));
            setCell("L", mainRow, mainTier?.Std_Stock);

            tiers.forEach((tier: any, index: number) => {
                const row = startRow + index;

                setCell("M", row, tier?.Tier_No ?? index + 1);
                setCell("N", row, tier?.Sup_Name);
                setCell("O", row, tier?.Product_No ?? partMaster?.Product_No);
                setCell("P", row, tier?.Product_Name ?? tier?.Product_Name ?? partMaster?.Product_Name);
                setCell("Q", row, tier?.Country);
                setCell("R", row, tier?.Province);
                setCell("S", row, tier?.District);
                setCell("T", row, tier?.Inductrial_Estate);
                setCell("U", row, yesIf(tier?.d_sup_name));
                setCell("V", row, yesIf(tier?.p_sup_name));
                setCell("W", row, tier?.Std_Stock);

                setCell("Y", row, tier?.d_sup_name);
                setCell("Z", row, tier?.d_country);
                setCell("AA", row, tier?.d_province);
                setCell("AB", row, tier?.d_district);
                setCell("AC", row, tier?.p_sup_name);
                setCell("AD", row, tier?.p_country);
                setCell("AE", row, tier?.p_province);
                setCell("AF", row, tier?.p_district);
            });

            for (let row = startRow; row < startRow + desiredRows; row += 1) {
                for (let col = 2; col <= 32; col += 1) {
                    const cell = worksheet.getCell(row, col);
                    cell.alignment = { vertical: "middle", wrapText: true };
                    applyBorder(cell);
                }
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "Supply Chain Management1.xlsx";
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export Excel failed:", error);
        }
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
