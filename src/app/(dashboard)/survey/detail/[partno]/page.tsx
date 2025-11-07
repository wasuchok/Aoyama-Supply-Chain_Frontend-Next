"use client"

import TextField from "@/app/components/Input/TextField"
import { apiPublic } from "@/services/httpClient"
import { useParams } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { useForm } from "react-hook-form"

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
    const [partMaster, setPartMaster] = useState<any>(null)

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
        },
    });

    const fetchSpcPartMasterDetail = async () => {
        try {
            const { data, status } = await apiPublic.get(`/spc-part-master/${partno}`);
            if (status === 200 || status === 201) {
                console.log(data)
                setPartMaster(data.resultData.PartMaster)
            }
        } catch (error) {
            console.log("Error fetch data: ", error)
        }
    }

    useEffect(() => {
        fetchSpcPartMasterDetail()
    }, [])
    return (
        <>
            <main className="flex-1 overflow-y-auto p-4">
                <div className="flex  flex-col gap-4">

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

                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex gap-2 flex-col ">
                        <div className="text-lg font-semibold mb-5">
                            SUPPLIER INFORMATION
                        </div>

                        <div>
                            <TextField label="Supplier Name" placeholder="Please fill in information...." />
                        </div>

                        <div>
                            <TextField label="Industrial Estate" placeholder="Please fill in information...." />
                        </div>

                        <div>
                            <TextField label="Country" placeholder="Please fill in information...." />
                        </div>

                        <div>
                            <TextField label="Province" placeholder="Please fill in information...." />
                        </div>

                        <div>
                            <TextField label="City" placeholder="Please fill in information...." />
                        </div>


                    </div>
                </div>
            </main>
        </>
    )
}

export default Page
