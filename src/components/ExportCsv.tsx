"use client";   

import toast from "react-hot-toast";
import type { Application } from "@/types";
import { IoDownload } from "react-icons/io5";

type Props = {
    applications: Application[];
};  

export default function ExportCSV({ applications } : Props) {
    const exportToCSV = () => {
        if(!applications || applications.length === 0) {
            toast.error("No applications to export.");
            return;
        }

        const headers = [
            "ID",
            "Company",
            "Job Title",
            "Date Applied",
            "Status",
            "Notes",
            "Follow Up Date",
            "Job Link",
            "Job Description",
            "Location",
            "Contact Name",
            "Contact Email",
            "Created At",
        ];
        
        const rows = applications.map((app) => {
            const escapeCsvField = (field: string | null | undefined ) => {
                if (field === null || field === undefined) return '';
                const stringField = String(field);

                if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
                    return `"${stringField.replace(/"/g, '""')}"`;
                }
                return stringField;
            };

            return [
        escapeCsvField(String(app.id)),
        escapeCsvField(app.company),
        escapeCsvField(app.jobTitle),
        escapeCsvField(new Date(app.dateApplied).toLocaleDateString('en-CA')), // Format date for readability
        escapeCsvField(app.status),
        escapeCsvField(app.notes),
        escapeCsvField(app.jobUrl),
        escapeCsvField(app.followUpDate ? new Date(app.followUpDate).toLocaleDateString('en-CA') : ''),
        escapeCsvField(new Date(app.createdAt).toLocaleDateString('en-CA')),
            ].join(",");
        });

        const csvContent = [headers.join(","), ...rows].join("\n");

        const blob = new Blob([ csvContent ], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "trackr-applications.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url);

        toast.success("Applications exported successfully!");   
    }

    return (
        <button
            onClick={exportToCSV}
            className="w-full p-3 bg-wood-dark text-white rounded-lg shadow-md hover:bg-wood-darker transition-colors duration-200 flex items-center justify-center font-bold"
        >
            <IoDownload className="mr-2 text-xl" />
            Export to CSV
        </button>
    )
}