import { Link } from "react-router-dom";

const SubmissionSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-black text-white font-orbitron">
      <h1 className="text-4xl font-bold mb-4">Submission Successful!</h1>
      <p className="mb-6 text-lg">Thank you for submitting your response.</p>
      <Link
        to="/"
        className="bg-primary-red px-6 py-3 rounded-lg font-bold hover:opacity-70 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default SubmissionSuccess;
