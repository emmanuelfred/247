import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../Component/PropertyCard";
import PropertySearchBar from "../Component/PropertySearchBar";
import { usePropertyStore } from "../stores/Propertystore";

export default function PropertyList() {
  const { properties, loading, fetchProperties, searchProperties } = usePropertyStore();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if there are search params
    const hasSearchParams = searchParams.toString().length > 0;

    if (hasSearchParams) {
      // Build search filters from URL params
      const filters = {};
      
      if (searchParams.get('q')) filters.q = searchParams.get('q');
      if (searchParams.get('location')) filters.location = searchParams.get('location');
      if (searchParams.get('property_type')) filters.property_type = searchParams.get('property_type');
      if (searchParams.get('min_price')) filters.min_price = searchParams.get('min_price');
      if (searchParams.get('max_price')) filters.max_price = searchParams.get('max_price');

      // Search with filters
      searchProperties(filters);
    } else {
      // Fetch all properties
      fetchProperties();
    }
  }, [searchParams]);

  // Check if we're showing search results
  const isSearching = searchParams.toString().length > 0;
  const searchQuery = searchParams.get('q');

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Empty state
  const isEmpty = !properties || properties.length === 0;

  return (
    <div className="max-w-6xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
      <div className="mb-5">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">Discover Your New Home</h2>
        <p>Browse verified apartments, duplexes, and land for sale and rent.</p>
      </div>
      
      <div className="flex items-center bg-white rounded-lg border-2 border-gray-100 p-2 space-x-2 w-full py-4 mb-6">
        <PropertySearchBar/>
      </div>

      {/* Show search info if searching */}
      {isSearching && !isEmpty && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            {searchQuery ? (
              <>Showing results for <strong>"{searchQuery}"</strong></>
            ) : (
              <>Showing filtered results</>
            )}
            {properties.length > 0 && <> - {properties.length} properties found</>}
          </p>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {isSearching ? `Found ${properties.length} ${properties.length === 1 ? 'Home' : 'Homes'}` : `Showing ${properties.length} ${properties.length === 1 ? 'Home' : 'Homes'}`}
      </h2>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg border border-gray-200">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
          </div>
          {isSearching ? (
            <>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Properties Found
              </h3>
              <p className="text-gray-500 text-center mb-4">
                No properties match your search criteria. Try different keywords or filters.
              </p>
              <button
                onClick={() => window.location.href = '/properties'}
                className="text-blue-600 hover:underline font-medium"
              >
                Clear search and show all properties
              </button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Properties Available
              </h3>
              <p className="text-gray-500 text-center">
                There are no properties listed at the moment. Please check back later!
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              id={property.id}
              image={property.thumbnail || "/Frame.png"}
              title={property.property_title}
              address={`${property.city}, ${property.state}`}
              beds={property.bedrooms}
              baths={property.bathrooms}
              area={`${property.size_sqm}m²`}
              price={`₦${parseFloat(property.price).toLocaleString()}`}
              period={property.price_period}
              propertyType={property.property_type}
              listingType={property.listing_type}
              viewCount={property.view_count}
              inquiryCount={property.inquiry_count}
            />
          ))}
        </div>
      )}
    </div>
  );
}