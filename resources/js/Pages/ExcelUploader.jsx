import React, { useState } from 'react';
import axios from 'axios';
// import { Head } from '@inertiajs/react';
// import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import Swal from "sweetalert2";
import { CloudUpload, Loader2 } from 'lucide-react';

export default function ExcelUploader() {
    const [file, setFile] = useState(null);
    const [failures, setFailures] = useState([]);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) {
            Swal.fire("No file selected", "Please choose an Excel file to upload", "warning");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);

        try {
            const response = await axios.post("/api/import-matches", formData);
            setFailures(response.data.failures || []);
            setDownloadUrl(response.data.download_url);
            Swal.fire("Success", "Excel imported successfully!", "success");
        } catch (error) {
            Swal.fire("Upload Failed", "Something went wrong during upload", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        // <AuthenticatedLayout>
        //     <Head title="Import Excel" />
            <div className="p-12 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📤 Excel Importer</h2>

                <div className="bg-white border border-gray-200 rounded-xl shadow p-8">
                    <label className="block mb-4">
                        <span className="text-gray-800 font-medium">Choose Excel File</span>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="mt-2 block w-full text-sm
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-medium
                            file:bg-blue-100 file:text-blue-700
                            hover:file:bg-blue-200"
                        />
                    </label>

                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2.5 px-4 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <CloudUpload className="h-5 w-5" />
                                Upload Excel
                            </>
                        )}
                    </button>
                </div>

                {failures.length > 0 && (
                    <div className="mt-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-red-600">Import Errors</h3>

                            {downloadUrl && (
                                <a
                                    href={downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow transition-colors"
                                >
                                    Download Excel of Failures
                                </a>
                            )}
                        </div>

                        <div className="overflow-auto rounded-lg border border-gray-300">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 border-b border-gray-300">
                                <tr>
                                    <th className="border px-4 py-2 font-medium text-gray-700">Row</th>
                                    <th className="border px-4 py-2 font-medium text-gray-700">Name</th>
                                    <th className="border px-4 py-2 font-medium text-gray-700">Email</th>
                                    <th className="border px-4 py-2 font-medium text-gray-700">Phone</th>
                                    <th className="border px-4 py-2 font-medium text-gray-700">Gender</th>
                                    <th className="border px-4 py-2 font-medium text-gray-700">Errors</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {failures.map((fail, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2 text-gray-700">{fail.row}</td>
                                        <td className="border px-4 py-2 text-gray-700">{fail.data.name}</td>
                                        <td className="border px-4 py-2 text-gray-700">{fail.data.email}</td>
                                        <td className="border px-4 py-2 text-gray-700">{fail.data.phone}</td>
                                        <td className="border px-4 py-2 text-gray-700">{fail.data.gender}</td>
                                        <td className="border px-4 py-2 text-gray-700">
                                            <ul className="list-disc pl-5 space-y-1">
                                                {Object.entries(fail.errors).map(([field, messages], i) => (
                                                    <li key={i}><strong>{field}</strong>: {messages.join(', ')}</li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        // </AuthenticatedLayout>
    );
}
