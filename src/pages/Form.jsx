import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const CLOUDINARY_UPLOAD_PRESET = "StarFormOrkes";
const CLOUDINARY_CLOUD_NAME = "dznnbdrzo";
const REPO_URL = "https://github.com/conductor-oss/conductor";

const Form = () => {
  const [params] = useSearchParams();
  const name = params.get("name");
  const email = params.get("email");
  const github = params.get("github");

  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const [compliance1, setCompliance1] = useState(false);
  const [compliance2, setCompliance2] = useState(false);

  useEffect(() => {
    if (screenshot) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(screenshot);
    } else {
      setPreview(null);
    }
  }, [screenshot]);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!compliance1 || !compliance2 || !screenshot) {
    alert("Please complete all required fields.");
    return;
  }

  try {
    console.log("📤 Uploading to Cloudinary...");
    const image_url = await uploadToCloudinary(screenshot);
    console.log("✅ Cloudinary response:", image_url);

    if (!image_url) {
      throw new Error("Cloudinary upload failed – no image URL returned");
    }

    const submittedData = { name, email, github, image_url };
    console.log("🛠 Inserting into Supabase:", submittedData);

    const { error } = await supabase.from("submissions").insert([submittedData]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      throw error;
    }

    alert("✅ Submission successful!");
    window.location.href = "/";
  } catch (err) {
    console.error("❌ Submission error:", err);
    alert("Submission failed. Check console for details.");
  }
};


  const isFormValid = compliance1 && compliance2 && screenshot;

  return (
  <div className="flex flex-col lg:flex-row min-h-screen bg-primary-black font-orbitron">
    {/* Top/Left Image */}
    <div className="w-full lg:w-1/3">
      <picture>
        {/* Image for mobile & tablet */}
        <source media="(max-width: 1023px)" srcSet="/Images/form-bg.png" />
        {/* Image for desktop */}
        <img
          src="/Images/form-bg-desk.png"
          alt="Star Gated"
          className="w-full h-48 lg:h-full object-cover"
        />
      </picture>
    </div>

    {/* Right Form */}
    <div className="flex-1 flex items-center justify-center bg-primary-black">
      <div className="p-8 max-w-xl w-full space-y-6">
        <h2 className="text-4xl font-bold text-white text-center tracking-wider leading-relaxed">
          Submit Your Response
        </h2>

        {/* Name */}
        <div>
          <label className="block text-white font-medium">Name</label>
          <input
            value={name}
            disabled
            className="w-full p-2 border border-white rounded bg-white text-primary-black"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-white font-medium">Email</label>
          <input
            value={email}
            disabled
            className="w-full p-2 border border-white rounded bg-white text-primary-black"
          />
        </div>

        {/* GitHub ID */}
        <div>
          <label className="block text-white font-medium">GitHub ID</label>
          <input
            value={github}
            disabled
            className="w-full p-2 border border-white rounded bg-white text-primary-black"
          />
        </div>

        {/* Repo Link */}
        <div className="flex items-center gap-2">
          <label className="text-white font-medium">Required Repo:</label>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline font-semibold"
          >
            Visit & Star Repo
          </a>
        </div>

        {/* Upload */}
        <div>
          <label className="block text-white font-medium">Upload Screenshot</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScreenshot(e.target.files[0])}
            className="w-full mt-1 text-white"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-2 h-40 object-contain border border-primary-black"
            />
          )}
        </div>

        {/* Compliance Checkboxes */}
        <div className="space-y-2 text-white">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={compliance1}
              onChange={() => setCompliance1(!compliance1)}
              className="accent-primary-red"
            />
            I confirm I have starred the required repository
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={compliance2}
              onChange={() => setCompliance2(!compliance2)}
              className="accent-primary-red"
            />
            I agree to the terms and conditions of participation
          </label>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full py-3 rounded font-bold tracking-wide text-white ${
            isFormValid
              ? "bg-primary-red hover:opacity-70 transition"
              : "bg-primary-red cursor-not-allowed"
          }`}
        >
          Submit Form
        </button>
      </div>
    </div>
  </div>
);

};

export default Form;
