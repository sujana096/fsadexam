import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Reports() {
  const { user } = useAuth();

  const [reports, setReports] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ FETCH (READ)
  const fetchReports = () => {
    fetch("http://localhost:8080/api/reports")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ✅ CREATE
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    fetch("http://localhost:8080/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?.id,
        serviceId: String(formData.get("serviceId")),
        title: String(formData.get("issueTitle")),
        description: String(formData.get("description")),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Report added");
        setIsModalOpen(false);
        fetchReports();
      })
      .catch((err) => console.error(err));
  };

  // ✅ DELETE
  const deleteReport = (id: number) => {
    fetch(`http://localhost:8080/api/reports/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        toast.success("Deleted");
        fetchReports();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Issue Reports</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 flex items-center gap-2"
      >
        <Plus size={18} /> New Report
      </button>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Title</th>
            <th className="p-2">Description</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No reports
              </td>
            </tr>
          ) : (
            reports.map((r) => (
              <tr key={r.id}>
                <td className="p-2">{r.title}</td>
                <td className="p-2">{r.description}</td>
                <td className="p-2">
                  <button
                    onClick={() => deleteReport(r.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <div className="flex justify-between">
              <h2>Add Report</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 mt-4">
              <input
                name="serviceId"
                placeholder="Service ID"
                className="border w-full p-2"
                required
              />

              <input
                name="issueTitle"
                placeholder="Title"
                className="border w-full p-2"
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                className="border w-full p-2"
                required
              />

              <button className="bg-green-600 text-white w-full p-2 rounded">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}