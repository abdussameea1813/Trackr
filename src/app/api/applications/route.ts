import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const applications = await prisma.application.findMany();
        return NextResponse.json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const application = await prisma.application.create({
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
                contactEmail: data. contactEmail
            }
        });
        return NextResponse.json(application);
    } catch (error) {
        console.error("Error creating application:", error);
        return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
    }
}