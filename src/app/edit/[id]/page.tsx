// app/edit/[id]/page.tsx (or wherever your EditApplication component resides)
import ApplicationForm from "@/components/ApplicationForm";
import { notFound } from "next/navigation";
import { format } from "date-fns";

type Props = {
  params: { id: string };
};

export default async function EditApplication({ params }: Props) {
  const res = await fetch(`http://localhost:3000/api/applications/${params.id}`);

  if (!res.ok) {
    console.error(
      `Failed to fetch application with ID : ${res.statusText}`
    );
    notFound();
  }

  const data = await res.json();

  const formattedData = {
    ...data,
    dateApplied: data.dateApplied
      ? format(new Date(data.dateApplied), "yyyy-MM-dd")
      : "",
    followUpDate: data.followUpDate
      ? format(new Date(data.followUpDate), "yyyy-MM-dd")
      : "",
  };

  return <ApplicationForm defaultValues={formattedData} id={parseInt(params.id)} />;
}