import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ALLOWED_ADMINS = ["milangmatt", ]; // Add allowed GitHub usernames here

const Admin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const githubParam = new URLSearchParams(window.location.search).get("github");

  useEffect(() => {
    if (!ALLOWED_ADMINS.includes(githubParam)) {
      window.location.href = "/"; // redirect non-admin
    } else {
      fetchSubmissions();
    }
  }, [githubParam]);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Fetch error:", error);
    } else {
      setData(data);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this entry?");
    if (!confirm) return;

    const { error } = await supabase.from("submissions").delete().eq("id", id);
    if (!error) {
      setData(data.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-semibold mb-4">Admin Dashboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-gray-600">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">GitHub</th>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, idx) => (
                <tr key={entry.id} className="border-t border-gray-700">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">{entry.name}</td>
                  <td className="p-2">{entry.email}</td>
                  <td className="p-2">{entry.github}</td>
                  <td className="p-2">
                    <a
                      href={entry.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      View
                    </a>
                  </td>
                  <td className="p-2">{new Date(entry.created_at).toLocaleString()}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
