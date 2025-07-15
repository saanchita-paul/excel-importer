import React, { useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
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
        <div>
            <AuthenticatedLayout>
             <Head title="Import Excel" />
            <div className="p-12 items-center justify-center w-full">
            <h2 className="text-xl font-bold mb-4">Excel Importer</h2>
                <div className="max-w-full mx-auto bg-white dark:bg-gray-900 shadow-md rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">📤 Excel Importer</h2>

                    <label className="block">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Choose Excel File</span>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="mt-2 block w-full text-sm text-gray-700 dark:text-gray-200
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100
                       dark:file:bg-gray-800 dark:file:text-gray-100 dark:hover:file:bg-gray-700"
                        />
                    </label>

                    <button
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleUpload}
                        disabled={loading}
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
                <div className="mt-6">
                    <h3 className="text-red-600 font-semibold mb-2">Import Errors</h3>
                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            target="_blank"
                            className="text-blue-500 underline mb-4 inline-block"
                        >
                            Download Excel of Failures
                        </a>
                    )}

                    <table className="border border-collapse w-full mt-2 text-sm">
                        <thead>
                        <tr>
                            <th className="border px-2 py-1">Row</th>
                            <th className="border px-2 py-1">Name</th>
                            <th className="border px-2 py-1">Email</th>
                            <th className="border px-2 py-1">Phone</th>
                            <th className="border px-2 py-1">Gender</th>
                            <th className="border px-2 py-1">Errors</th>
                        </tr>
                        </thead>
                        <tbody>
                        {failures.map((fail, idx) => (
                            <tr key={idx}>
                                <td className="border px-2 py-1">{fail.row}</td>
                                <td className="border px-2 py-1">{fail.data.name}</td>
                                <td className="border px-2 py-1">{fail.data.email}</td>
                                <td className="border px-2 py-1">{fail.data.phone}</td>
                                <td className="border px-2 py-1">{fail.data.gender}</td>
                                <td className="border px-2 py-1">
                                    <ul className="list-disc pl-4">
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
            )}
        </div>
            </AuthenticatedLayout>
        </div>

    );
}
