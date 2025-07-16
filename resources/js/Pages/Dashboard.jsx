import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ExcelUploader from "@/Pages/ExcelUploader.jsx";

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <ExcelUploader/>
        </AuthenticatedLayout>
    );
}
