import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const application = await prisma.application.findUnique({
            where: { id: parseInt(params.id) },
        });

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        return NextResponse.json(application);
    } catch (error) {
        console.error("Error fetching application:", error);
        return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const data = await request.json();
        const application = await prisma.application.update({
            where: { id: params.id },
            data: {
                company: data.company,
                jobTitle: data.jobTitle,
                dateApplied: new Date(data.dateApplied),
                status: data.status,
                notes: data.notes,
                followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
                jobLink: data.jobLink,
                jobDescription: data.jobDescription,
                location: data.location,
                contactName: data.contactName,
                contactEmail: data.contactEmail
            }
        });
        return NextResponse.json(application);
    } catch (error) {
        console.error("Error updating application:", error);
        return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.application.delete({
            where: { id: parseInt(params.id) },
        });
        return NextResponse.json({ message: "Application deleted successfully" });
    } catch (error) {
        console.error("Error deleting application:", error);
        return NextResponse.json({ error: "Failed to delete application" }, { status: 500 }); 
    }
}