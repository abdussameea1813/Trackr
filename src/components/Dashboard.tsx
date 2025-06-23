"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoAdd,
  IoSearch,
  IoFunnel,
  IoBusiness,
  IoBriefcase,
  IoCalendar,
  IoStatsChart,
  IoDocumentText,
  IoLink,
  IoPencil,
  IoArrowForwardCircle,
  IoWarning,
  IoSyncCircle,
  IoMailOutline,
  IoDownload,
} from "react-icons/io5";
import ExportCSV from "@/components/ExportCsv";
import type { Application } from "@/types";


const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  });

export default function Dashboard() {
  const { data: applications, error, isLoading } = useSWR<Application[]>("/api/applications", fetcher);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("dateApplied");

  const STATUS_MAP = {
    Applied: { color: "text-status-applied", bg: "bg-status-applied/20", icon: <IoDocumentText className="inline-block mr-1" /> },
    Rejected: { color: "text-status-rejected", bg: "bg-status-rejected/20", icon: <IoWarning className="inline-block mr-1" /> },
    Interview: { color: "text-status-interview", bg: "bg-status-interview/20", icon: <IoSyncCircle className="inline-block mr-1" /> },
    Success: { color: "text-status-success", bg: "bg-status-success/20", icon: <IoStatsChart className="inline-block mr-1" /> },
    All: { color: "text-text-primary", bg: "bg-bg-tertiary", icon: <IoFunnel className="inline-block mr-1" /> },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delayChildren: 0.1, staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  if (error)
    return (
      <div className="p-8 text-center bg-bg-primary min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-bg-secondary p-8 rounded-2xl shadow-lg border border-border-light flex flex-col items-center"
        >
          <IoWarning className="text-status-rejected text-5xl mb-4 animate-pulse" />
          <p className="text-h3 font-extrabold mb-2 text-text-heading">Application Error!</p>
          <p className="text-base text-text-secondary mb-4">Failed to load data. {error.message}</p>
          <motion.button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-accent-primary text-white font-semibold rounded-lg shadow-md hover:bg-accent-dark transition-all duration-300 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoSyncCircle className="mr-2 text-xl" /> Retry
          </motion.button>
        </motion.div>
      </div>
    );

  if (isLoading)
    return (
      <div className="p-8 text-center bg-bg-primary min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4 text-text-primary"
        >
          <motion.svg
            className="animate-spin h-12 w-12 text-accent-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </motion.svg>
          <p className="text-h4 font-bold text-text-heading">Loading your applications...</p>
          <p className="text-sm text-text-secondary">Fetching the latest data. Just a moment!</p>
        </motion.div>
      </div>
    );

  if (!applications || applications.length === 0)
    return (
      <div className="p-8 text-center bg-bg-primary min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-bg-secondary p-10 rounded-2xl shadow-lg border border-border-light flex flex-col items-center"
        >
          <IoStatsChart className="text-accent-primary text-6xl mb-6 opacity-80" />
          <p className="text-h2 font-extrabold text-text-heading mb-4">No Applications Yet!</p>
          <p className="text-base text-text-secondary mb-8 max-w-md">It looks like your Trackr is empty. Let's start building your job application journey!</p>
          <Link
            href="/add"
            className="inline-flex items-center px-8 py-4 bg-accent-primary text-white font-bold rounded-xl shadow-md hover:bg-accent-dark transition-colors duration-300"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center">
              <IoAdd className="mr-3 text-2xl" /> Add Your First Application
            </motion.div>
          </Link>
        </motion.div>
      </div>
    );

  const filteredApps = applications
    .filter((app) =>
      (app.company.toLowerCase().includes(search.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        (app.notes && app.notes.toLowerCase().includes(search.toLowerCase()))) &&
      (statusFilter === "All" || app.status === statusFilter)
    )
    .sort((a, b) =>
      sortBy === "dateApplied"
        ? new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()
        : a.company.localeCompare(b.company)
    );

  const stats = {
    total: applications.length,
    applied: applications.filter((app) => app.status === "Applied").length,
    rejected: applications.filter((app) => app.status === "Rejected").length,
    interview: applications.filter((app) => app.status === "Interview").length,
    success: applications.filter((app) => app.status === "Success").length,
  };


  const getStatusColorClass = (status: string) => STATUS_MAP[status as keyof typeof STATUS_MAP]?.color || "";
  const getStatusBgClass = (status: string) => STATUS_MAP[status as keyof typeof STATUS_MAP]?.bg || "";
  const getStatusIcon = (status: string) => STATUS_MAP[status as keyof typeof STATUS_MAP]?.icon || null;

  

  return (
    <motion.div
      className="p-4 sm:p-6 md:p-8 bg-bg-primary min-h-screen text-text-primary font-inter transition-colors duration-300"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
        <h1 className="text-h1 font-extrabold text-text-heading relative leading-tight">
          Trackr <span className="text-accent-primary">Dashboard</span>
          <span className="absolute -bottom-2 left-0 w-2/3 h-1.5 bg-accent-primary rounded-full opacity-70" />
        </h1>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {Object.entries(stats).slice(1).map(([key, value]) => {
          const statusName = key.charAt(0).toUpperCase() + key.slice(1);
          const statusClasses = STATUS_MAP[statusName as keyof typeof STATUS_MAP];
          if (!statusClasses) return null;
          return (
            <motion.div
              key={key}
              variants={itemVariants}
              className={`p-5 rounded-2xl shadow-lg text-center relative overflow-hidden group ${statusClasses.bg} border border-border-light transition-all duration-300`}
              whileHover={{ scale: 1.03, boxShadow: "var(--shadow-level-3)" }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-white/5 dark:bg-black/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className={`relative z-10 ${statusClasses.color}`}>
                <p className="font-extrabold text-h2">{value}</p>
                <p className="text-sm sm:text-base mt-2 font-medium">{getStatusIcon(statusName)} {statusName}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      
      <motion.div variants={itemVariants} className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-grow">
          <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-xl" />
          <input
            type="text"
            placeholder="Search by company, job title, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 pl-12 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-accent-primary shadow-inner text-text-primary bg-bg-tertiary placeholder-text-secondary transition-colors duration-200"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-auto p-3 pl-4 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-accent-primary shadow-inner text-text-primary bg-bg-tertiary appearance-none pr-10 transition-colors duration-200"
        >
          <option value="dateApplied">Date Applied (Newest)</option>
          <option value="company">Company (A-Z)</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-8 justify-center sm:justify-start">
        {["All", "Applied", "Interview", "Rejected", "Success"].map((status) => (
          <motion.button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-6 py-2.5 rounded-full shadow-md font-semibold transition-all duration-300 flex items-center ${
              statusFilter === status
                ? "bg-accent-primary text-white shadow-lg border border-accent-primary hover:bg-accent-dark"
                : "bg-bg-secondary text-text-primary border border-border-light hover:bg-bg-tertiary"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {status === "All" ? <IoFunnel className="mr-2 text-lg" /> : getStatusIcon(status)}
            {status}
          </motion.button>
        ))}
      </motion.div>

      {applications.length > 0 && (
        <motion.div variants={itemVariants} className="mb-8">
          <ExportCSV applications={applications} />
        </motion.div>
      )}

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 pb-20">
        <AnimatePresence>
          {filteredApps.length === 0 ? (
            <motion.div
              key="no-apps-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center p-10 bg-bg-secondary rounded-2xl shadow-lg border border-border-light"
            >
              <p className="text-h4 font-semibold text-text-primary mb-3">No applications match your criteria.</p>
              <p className="text-base text-text-secondary">Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            filteredApps.map((app) => (
              <motion.div
                key={app.id}
                variants={itemVariants}
                className="p-5 bg-bg-secondary rounded-2xl shadow-lg border border-border-light relative group overflow-hidden"
                whileHover={{ scale: 1.01, boxShadow: "var(--shadow-level-3)" }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
              >
                <div className={`absolute top-0 left-0 bottom-0 w-2 rounded-l-2xl ${getStatusBgClass(app.status)}`} />
                <div className="flex items-center justify-between mb-3 pl-3">
                  <h2 className="text-h4 font-extrabold text-text-heading leading-tight">
                    <IoBusiness className="inline-block mr-2 text-accent-primary" /> {app.company}
                  </h2>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center shadow-sm ${getStatusColorClass(app.status)} ${getStatusBgClass(app.status)}`}>
                    {getStatusIcon(app.status)} {app.status}
                  </span>
                </div>
                <p className="text-base font-regular mb-3 pl-3 text-text-primary">
                  <IoBriefcase className="inline-block mr-2 text-text-secondary" /> {app.jobTitle}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm text-text-secondary mb-4 pl-3">
                  <p className="flex items-center">
                    <IoCalendar className="mr-2" /> Applied: {format(new Date(app.dateApplied), "MMM d, yyyy")}
                  </p>
                  {app.followUpDate && (
                    <p className="flex items-center">
                      <IoCalendar className="mr-2" /> Follow up: {format(new Date(app.followUpDate), "MMM d, yyyy")}
                    </p>
                  )}
                </div>
                {app.notes && (
                  <p className="text-sm italic mt-4 mb-4 border-t border-border-dark pt-3 pl-3 text-text-secondary">
                    <span className="font-semibold text-text-primary">Notes:</span> {app.notes}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 mt-5 pl-3">
                  {app.jobUrl && (
                    <motion.a
                      href={app.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2.5 bg-accent-primary text-white text-base font-semibold rounded-lg shadow-md hover:bg-accent-dark transition-colors duration-200 group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IoLink className="mr-2 text-lg" /> View Job <IoArrowForwardCircle className="ml-2 group-hover:translate-x-1 transition-transform text-xl" />
                    </motion.a>
                  )}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href={`/edit/${app.id}`}
                      className="inline-flex items-center px-5 py-2.5 bg-bg-tertiary text-text-primary text-base font-semibold rounded-lg shadow-md hover:bg-border-dark transition-colors duration-200 group"
                    >
                      <IoPencil className="mr-2 text-lg" /> Edit <IoArrowForwardCircle className="ml-2 group-hover:translate-x-1 transition-transform text-xl" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      <Link
        href="/add"
        className="fixed bottom-6 right-6 bg-accent-primary text-white p-5 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center text-4xl font-bold z-50"
        style={{ width: "72px", height: "72px" }}
        title="Add New Application"
      >
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.15, y: -8 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center w-full h-full"
        >
          <IoAdd />
        </motion.div>
      </Link>

    </motion.div>
  );
}