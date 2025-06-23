"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { IoCopyOutline, IoCloseCircleOutline, IoMailOutline, IoRefresh } from "react-icons/io5"; // Importing icons

type Props = {
  company: string;
  jobTitle: string;
  onClose: () => void;
};

export default function EmailModal({ company, jobTitle, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const generateEmail = async () => {
    setLoading(true);
    setEmail(""); // Clear previous email
    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, jobTitle }),
      });
      const data = await res.json();
      if (res.ok && data.email) {
        setEmail(data.email);
        toast.success("Email generated successfully!");
      } else {
        toast.error(data.error || "Failed to generate email. Please try again.");
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      toast.error("An unexpected error occurred while generating email.");
    } finally {
      setLoading(false);
    }
  };

  const copyEmailToClipboard = () => {
    // Using document.execCommand('copy') for better iframe compatibility if this runs in a sandbox
    const textArea = document.createElement("textarea");
    textArea.value = email;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      toast.success("Email copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error("Failed to copy email. Please copy manually.");
    }
    document.body.removeChild(textArea);
  };

  // Generate email automatically when modal opens if it's new generation
  useState(() => {
    if (!email) { // Only generate if email is empty (i.e., first open or cleared)
      generateEmail();
    }
  });


  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-card dark:bg-gray-800 p-8 rounded-2xl shadow-3 max-w-md w-full border border-gray-200 dark:border-gray-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
          title="Close"
        >
          <IoCloseCircleOutline className="text-3xl" />
        </button>
        <h2 className="text-3xl font-extrabold text-wood-dark dark:text-wood-light mb-5 text-center">
          <IoMailOutline className="inline-block mr-2 text-wood-accent" /> Follow-Up Email
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-40">
            <svg className="animate-spin h-8 w-8 text-wood-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">Generating email...</p>
          </div>
        ) : (
          <textarea
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-lg border border-wood-dark dark:border-gray-600 h-64 focus:outline-none focus:ring-2 focus:ring-applied text-wood-dark dark:text-white bg-white dark:bg-gray-700 shadow-inset resize-y font-mono text-sm"
            placeholder="Click 'Generate Email' to create a draft..."
          />
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          {!email && !loading && (
            <button
              onClick={generateEmail}
              className="flex-1 p-3 bg-applied text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200 font-bold flex items-center justify-center"
            >
              <IoMailOutline className="mr-2" /> Generate Email
            </button>
          )}

          {email && (
            <>
              <button
                onClick={copyEmailToClipboard}
                className="flex-1 p-3 bg-wood-dark text-white rounded-lg shadow-md hover:bg-wood-darker transition-colors duration-200 font-bold flex items-center justify-center"
              >
                <IoCopyOutline className="mr-2" /> Copy
              </button>
              <button
                onClick={generateEmail}
                className="flex-1 p-3 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-200 font-bold flex items-center justify-center"
              >
                <IoRefresh className="mr-2" /> Regenerate
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="flex-1 p-3 bg-rejected text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200 font-bold flex items-center justify-center"
          >
            <IoCloseCircleOutline className="mr-2" /> Close
          </button>
        </div>
      </div>
    </div>
  );
}
