import { useNavigate } from "react-router-dom";
export default function SuccessApplcation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex  items-center justify-center ">
            <div className="flex flex-col items-center justify-center bg-white text-center px-4 bg-white shadow-sm p-4 rounded" style={{maxWidth:'600px',width:'90%'}}>
      {/* Illustration */}
      <img
        src="/delete-illustration.png"
        alt="404 illustration"
        className="w-100 h-auto "
      />

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Application Submitted Successfully
      </h1>

      {/* Subtext */}
      <p className="text-gray-500 mb-6 text-sm">
       Your application for UI/UX Designer has been sent successfully. The employer will reach out if shortlisted.
      </p>
     <div className="flex gap-3 mt-3 md:mt-0 w-full flex-col md:flex-row ">
                <button className="flex flex-1 items-center justify-center gap-2 py-2  rounded-md bg-[#FCEEE7] ">
                  View My Applications
                </button>
                <button  onClick={() => navigate("/")} className="flex flex-1 items-center justify-center gap-2  py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md">
                   Continue Browsing Jobs
                </button>
              </div>

    </div>

    </div>

  );
}