import React from "react";
import { FiTrash2, FiEdit } from "react-icons/fi";

export default function ListingCard({
  title = "UI/UX Designer",
  company = "Google",
  address,
  tags = null,
  status = "Approved", // Approved | Pending | Declined
  price = "₦300K/mt",
  date = "2 days ago",
  onDelete,
  onEdit,
  onResubmit,
}) {
  const statusColor =
    status === "Approved"
      ? "bg-green-100 text-green-700"
      : status === "Pending"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  const statusText =
    status === "Approved"
      ? "Approved"
      : status === "Pending"
      ? "Pending"
      : "Declined";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex gap-5 justify-between flex-col md:flex-row items-start  md:items-center hover:shadow-md transition">
         <div className="h-10 w-10 md:w-25 md:h-28  bg-gray-100 rounded-full ">
            <img src="/Frame.png" alt="" className="w-full h-full object-cover rounded-full md:rounded-lg"/>
        </div>
        <div className="w-full md:flex-1">
             {/* Left: Image + Info */}
            <div className="flex items-start space-x-4 justify-between">
            

                <div>
                <h3 className="font-semibold text-gray-800">{title}</h3>
                {company && <p className="text-sm text-gray-600">{company}</p>}
                {address && <p className="text-xs text-gray-500 mt-0.5">{address}</p>}

                {/* Tags */}
                {tags &&(

  <div className="flex space-x-2 mt-2">
                    {tags.map((tag, i) => (
                    <span
                        key={i}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md"
                    >
                        {tag}
                    </span>
                    ))}
                </div>
                )}
              
                </div>
                <div className="flex flex-col justify-between items-end gap-7">
                        <span
                        className={`text-xs px-2 py-1 rounded-md font-medium ${statusColor}`}
                        >
                        {statusText}
                        </span>

                        <p className="text-xs text-gray-500">{date}</p>

                       

                </div>
                

                
            
            </div>

            {/* Right: Status + Actions */}
            <div className="flex  items-center justify-between space-y-3 border-t border-gray-100 mt-3 p-2 pb-0">
            
                {/* Price */}
                <p className="text-blue-600 font-semibold text-sm ">{price}</p>
                <div className="flex  items-center justify-end gap-3 ">
                     {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                        {status === "Declined" && (
                            <button
                            onClick={onResubmit}
                            className="border text-xs px-3 py-1 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                            Re-Submit
                            </button>
                        )}
                        {status === "Declined" && (
                            <button
                            onClick={onEdit}
                            className="border p-1.5 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                            <FiEdit size={14} />
                            </button>
                        )}
                        
                    </div>
                    <button
                        onClick={onDelete}
                        className="border border-red-200 text-red-500 p-1.5 rounded-md hover:bg-red-50"
                    >
                            <FiTrash2 size={14} />
                    </button>
                </div>
                
            </div>
        </div>
     
    </div>
  );
}
