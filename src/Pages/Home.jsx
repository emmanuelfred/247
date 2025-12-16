import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../Component/Hero';
import JobCard from "../Component/JobCard";
import PropertyCard from '../Component/PropertyCard';
import Ads from '../Component/Ads';
import SearchTabs from '../Component/SearchTabs';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [trendingJobs, setTrendingJobs] = useState([]);
  const [latestProperties, setLatestProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all data when component mounts
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      // Fetch trending jobs (4 items)
      const jobsResponse = await axios.get(`${API_URL}/listings/trending-jobs/?limit=4`);
      setTrendingJobs(jobsResponse.data.jobs);

      // Fetch latest properties (4 items)
      const latestPropsResponse = await axios.get(`${API_URL}/listings/latest-properties/?limit=4`);
      setLatestProperties(latestPropsResponse.data.properties);

      // Fetch featured properties (4 items)
      const featuredPropsResponse = await axios.get(`${API_URL}/listings/featured-properties/?limit=4`);
      setFeaturedProperties(featuredPropsResponse.data.properties);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Hero />
        <div className="p-3 max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Hero />
      <div className="p-3 max-w-7xl mx-auto">
        <SearchTabs />

        {/* Trending Job Listings */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-1xl md:text-2xl font-bold leading-tight">
            Trending Job Listings
          </h2>
          <Link 
            to="/jobs" 
            className="text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            View All →
          </Link>
        </div>

        {trendingJobs.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg mb-6">
            <p className="text-gray-500">No jobs available yet</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {trendingJobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                company={job.company_name}
                title={job.job_title}
                type={[job.job_type.replace('_', ' '), job.category]}
                salary={`₦${job.minimum_salary}-${job.maximum_salary}/${job.salary_period.replace('per_', '')}`}
                location={`${job.city}, ${job.state}`}
                posted={job.created_at}
                thumbnail={job.thumbnail}
                posted_by={job.posted_by}
              />
            ))}
          </div>
        )}

        {/* Latest Home Listings */}
        <div className="my-4 flex justify-between items-center">
          <h2 className="text-1xl md:text-2xl font-bold leading-tight">
            Latest Home Listings
          </h2>
          <Link 
            to="/properties" 
            className="text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            View All →
          </Link>
        </div>

        {latestProperties.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg mb-6">
            <p className="text-gray-500">No properties available yet</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {latestProperties.map((property) => (
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

        {/* Ads */}
        <Ads />

        {/* Featured Properties */}
        <div className="my-4 flex justify-between items-center">
          <h2 className="text-1xl md:text-2xl font-bold leading-tight">
            Featured Properties
          </h2>
          <Link 
            to="/properties" 
            className="text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            View All →
          </Link>
        </div>

        {featuredProperties.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg mb-6">
            <p className="text-gray-500">No featured properties yet</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredProperties.map((property) => (
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
    </>
  );
}

export default Home;