"use client"

import TextField from "@/app/components/Input/TextField"
import ButtonTierGroup from "@/app/components/survey/detail/ButtonTierGroup"
import { apiPublic } from "@/services/httpClient"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { Controller, useForm } from "react-hook-form"
import { FiArrowLeft } from "react-icons/fi"

interface DetailItemProps {
    label: string
    value?: ReactNode
}

const DetailItem = ({ label, value }: DetailItemProps) => (
    <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
        <p className="mt-1 text-base font-medium text-gray-900 break-words">{value ?? "-"}</p>
    </div>
)

const Page = () => {
    const { partno } = useParams()
    const router = useRouter()
    const [partMaster, setPartMaster] = useState<any>(null)
    const [tierLength, setTierLength] = useState<number>(0)
    const [activeIndex, setActiveIndex] = useState(0)
    const [partInformation, setPartInformation] = useState<any>([])

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

        console.log("ℹ️ Tier info:", info);

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



    return (
        <>
            <main className="flex-1 overflow-y-auto p-4">
                <div className="flex  flex-col gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        <FiArrowLeft className="h-4 w-4" />
                        Back
                    </button>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">ATC Part no.</p>
                            <p className="text-2xl font-bold text-gray-900">{partMaster?.Part_No ?? '-'}</p>
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



                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex gap-2 flex-col ">
                        <div className="text-lg font-semibold mb-5">
                            SUPPLIER INFORMATION
                        </div>

                        <Controller
                            name="supplierName"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
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
                                    label="City"
                                    placeholder="Please fill in information..."
                                    {...field}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex gap-2 flex-col ">
                        <div className="text-lg font-semibold mb-5">
                            PRODUCTION INFORMATION
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">


                            <Controller
                                name="p_chainProcess"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
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
                                        label="Std. Stock (days)"
                                        placeholder="Please fill in information..."
                                        {...field}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />

                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex gap-2 flex-col ">
                        <div className="text-lg font-semibold mb-5">
                            BACK UP CONDITION
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2 border-r border-dashed border-gray-300 pr-4">
                                <div>
                                    <p className="">Dual Source</p>
                                    <Controller
                                        name="d_supplierName"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <TextField
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
                                <p className="">PD Replacement</p>
                                <Controller
                                    name="pd_supplierName"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
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
