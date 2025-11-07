"use client"

import TextField from "@/app/components/Input/TextField";
import { ScrollableTable } from "@/app/components/survey/table/ScrollableTable";
import { usePagination } from "@/app/hooks/usePagination";
import { useRouter } from "next/navigation";
import { FaCartShopping, FaNetworkWired } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";

const DashboardContent = () => {
    const router = useRouter()
    const { data, pagination, page, loading, fetchData } = usePagination(`/spc-part-master`);



    const columns: any[] = [
        { header: 'No.', accessor: 'no' },
        { header: 'ATC Part no', accessor: 'Part_No' },
        { header: 'Part name', accessor: 'Part_Name', },
        { header: 'Material name', accessor: 'Mat_Name', width: '120px' },
        { header: 'Diameter', accessor: 'Diameter', },
        { header: 'Production by', accessor: 'Production_By', },

    ];




    return (
        <main className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-6">
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                    <h1 className="mb-4 text-2xl font-semibold uppercase underline text-gray-700">Supply Chain Information</h1>

                    {/* SUPPLY CHAIN INFORMATION */}

                    <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:w-auto lg:grid-cols-3">
                        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">ATC</p>
                                    <p className="text-2xl font-bold text-gray-900">2,560</p>
                                </div>
                                <div className="rounded-lg bg-primary-50 p-3">
                                    <span className="text-xl text-primary-600">
                                        <IoIosPeople />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Supplier</p>
                                    <p className="text-2xl font-bold text-gray-900">526</p>
                                </div>
                                <div className="rounded-lg bg-green-50 p-3">
                                    <span className="text-xl text-green-600">
                                        <FaCartShopping />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Aoyama group</p>
                                    <p className="text-2xl font-bold text-gray-900">95</p>
                                </div>
                                <div className="rounded-lg bg-pink-50 p-3">
                                    <span className="text-xl text-pink-600">
                                        <FaNetworkWired />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:h-[calc(100vh-300px)]">

                    {loading && <p>กำลังโหลดข้อมูล...</p>}

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

export default DashboardContent
