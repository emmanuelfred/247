import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Home,
  MessageSquare,
  Users,
  UserCog,
  Megaphone,
  BarChart3,
  Settings,
  Bell,
  Upload,
  Search,
} from "lucide-react";

export default function AdvertisementPage() {
  const [file, setFile] = useState(null);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-5 hidden md:flex flex-col justify-between">
        <div>
          <h1 className="text-lg font-semibold mb-8 flex items-center gap-1">
            <span className="text-orange-500 text-xl">📍</span> 247Nigeria
          </h1>

          <nav className="space-y-2 text-gray-700">
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-500">
              <LayoutDashboard size={18} /> Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-500">
              <Briefcase size={18} /> Pending Jobs
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-500">
              <Home size={18} /> Pending Properties
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-500">
              <MessageSquare size={18} /> Messages
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-500">
              <Users size={18} /> Users
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-500">
              <UserCog size={18} /> Teams
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 bg-orange-50 text-orange-500 font-medium rounded-md">
              <Megaphone size={18} /> Advertisement
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-500">
              <BarChart3 size={18} /> Reports
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-orange-50 hover:text-orange-500">
              <Settings size={18} /> Settings
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 py-3">
          <div className="flex items-center w-full max-w-xl bg-white rounded-md border border-gray-200 px-3 py-2">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search listings, users..."
              className="w-full outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-4 ml-4">
            <div className="relative">
              <Bell size={20} className="text-gray-600 cursor-pointer" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Advertisement</h2>
          <p className="text-gray-500 text-sm">Post adverts</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Advert Link */}
            <div>
              <label className="block text-sm font-medium mb-1">Advert Link</label>
              <input
                type="email"
                placeholder="Janedoe@gmail.com"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            {/* Advert Time Frame */}
            <div>
              <label className="block text-sm font-medium mb-1">Advert time frame</label>
              <input
                type="text"
                placeholder="eg. 30 min"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Start date</label>
              <input
                type="date"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium mb-1">End date</label>
              <input
                type="date"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            {/* Advert Placement */}
            <div>
              <label className="block text-sm font-medium mb-1">Advert placement</label>
              <input
                type="text"
                placeholder="eg. Homepage top banner"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Upload Section */}
          <div className="mt-8">
            <label className="block text-sm font-medium mb-2">
              Add video to publish <span className="text-red-500">*</span>
            </label>
            <p className="text-gray-500 text-sm mb-3">
              Upload images or videos of your office to attract candidates
            </p>

            <div
              className="border-2 border-dashed border-gray-300 rounded-md p-10 text-center text-gray-500 cursor-pointer hover:bg-gray-50"
              onClick={() => document.getElementById("uploadInput").click()}
            >
              <Upload className="mx-auto mb-2 text-gray-400" size={28} />
              {file ? (
                <p className="text-gray-700 font-medium">{file.name}</p>
              ) : (
                <>
                  <p>Drop your Files Here</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Browse Files from your Computer
                  </p>
                </>
              )}
              <input
                id="uploadInput"
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8 flex justify-center">
            <button className="bg-orange-400 hover:bg-orange-500 text-white font-medium px-6 py-2 rounded-md">
              Publish advert
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
