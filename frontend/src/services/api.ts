import axios from "axios";
import type { ReportFormData, ReportResponse } from "../types";

const api = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 90000, // 90s — AI can be slow
});

export const generateReport = (data: ReportFormData): Promise<{ data: ReportResponse }> =>
  api.post("/generate-report", data);

export const downloadPdf = async (reportData: ReportResponse): Promise<void> => {
  const response = await api.post("/download-pdf", reportData, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `numerology-report-${reportData.full_name.replace(/\s+/g, "_")}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default api;
