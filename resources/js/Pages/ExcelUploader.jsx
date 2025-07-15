import React, { useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import Swal from "sweetalert2";
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
            <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files[0])}
                className="mb-4"
            />
            <button
                className="bg-blue-600 text-white px-4 py-2"
                onClick={handleUpload}
                disabled={loading}
            >
                {loading ? "Uploading..." : "Upload"}
            </button>

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
