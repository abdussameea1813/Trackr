"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import { motion } from "framer-motion";
import { IoLink, IoBusiness, IoBriefcase, IoCalendar, IoDocumentText, IoStatsChart } from "react-icons/io5";

import toast from "react-hot-toast";

type FormData = {
  jobUrl: string;
  company: string;
  jobTitle: string;
  dateApplied: string;
  status: string;
  notes?: string;
  followUpDate?: string;
};

type Props = {
  defaultValues?: FormData;
  id?: number;
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
};

export default function ApplicationForm({ defaultValues, id }: Props) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ defaultValues });
  const router = useRouter();
  const [scraping, setScraping] = useState(false);

  const scrapeJobDetails = async (url: string) => {
    setScraping(true);
    try {
      const res = await fetch("/api/scrape-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.company) setValue("company", data.company);
      if (data.jobTitle) setValue("jobTitle", data.jobTitle);
      setValue("jobUrl", url);
      toast.success("Job details scraped successfully!");
    } catch (error) {
      toast.error("Failed to scrape job details. Please enter manually.");
    }
    setScraping(false);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const url = id ? `/api/applications/${id}` : "/api/applications";
    const method = id ? "PUT" : "POST";
    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      toast.success(id ? "Application updated!" : "Application added!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to save application.");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 sm:p-6 md:p-8 bg-bg-primary min-h-screen text-text-primary font-inter"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-h1 font-extrabold text-text-heading mb-8">
        {id ? "Edit Application" : "Add Application"}
      </h1>
      <motion.div variants={itemVariants} className="space-y-6 max-w-lg mx-auto">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            <IoLink className="inline-block mr-2" /> Job Posting URL
          </label>
          <input
            type="url"
            {...register("jobUrl")}
            onBlur={(e) => e.target.value && scrapeJobDetails(e.target.value)}
            className="w-full p-3 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-accent-primary shadow-inset text-text-primary bg-bg-tertiary placeholder-text-secondary"
            placeholder="https://www.linkedin.com/jobs/view/123456789"
          />
          {scraping && <p className="text-sm text-text-secondary mt-2">Scraping job details...</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            <IoBusiness className="inline-block mr-2" /> Company
          </label>
          <input
            {...register("company", { required: true })}
            className="w-full p-3 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-accent-primary shadow-inset text-text-primary bg-bg-tertiary"
          />
          {errors.company && <p className="text-status-rejected text-sm mt-2">Company is required</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            <IoBriefcase className="inline-block mr-2" /> Job Title
          </label>
          <input
            {...register("jobTitle", { required: true })}
            className="w-full p-3 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-accent-primary shadow-inset text-text-primary bg-bg-tertiary"
          />
          {errors.jobTitle && <p className="text-status-rejected text-sm mt-2">Job Title is required</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            <IoCalendar className="inline-block mr-2" /> Date Applied
          </label>
          <input
            type="date"
            {...register("dateApplied", { required: true })}
            className="w-full p-3 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-accent-primary shadow-inset text-text-primary bg-bg-tertiary"
          />
          {errors.dateApplied && <p className="text-status-rejected text-sm mt-2">Date is required</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            <IoStatsChart className="inline-block mr-2" /> Status
          </label>
          <select
            {...register("status", { required: true })}
            className="w-full p-3 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-accent-primary shadow-inset text-text-primary bg-bg-tertiary"
          >
            <option value="Applied">Applied</option>
            <option value="Rejected">Rejected</option>
            <option value="Interview">Interview</option>
            <option value="Success">Success</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            <IoDocumentText className="inline-block mr-2" /> Notes
          </label>
          <textarea
            {...register("notes")}
            className="w-full p-3 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-accent-primary shadow-inset text-text-primary bg-bg-tertiary"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            <IoCalendar className="inline-block mr-2" /> Follow-Up Date
          </label>
          <input
            type="date"
            {...register("followUpDate")}
            className="w-full p-3 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-accent-primary shadow-inset text-text-primary bg-bg-tertiary"
          />
        </div>
        <motion.button
          type="submit"
          className="w-full p-3 bg-accent-primary text-white font-semibold rounded-xl shadow-md hover:bg-accent-dark transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save Application
        </motion.button>
      </motion.div>
    </motion.form>
  );
}
