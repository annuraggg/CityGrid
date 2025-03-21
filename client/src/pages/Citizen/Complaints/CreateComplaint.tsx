import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  ChevronRight,
  Upload,
  MapPin,
  Building,
  FileText,
  CheckCircle,
  HelpCircle,
  X,
  Clipboard,
  Info,
  ImagePlus,
  FileSpreadsheet,
  PenTool,
  LayoutDashboard,
  Crosshair,
  Clock
} from "lucide-react";

const FileComplaint = () => {
  const [formData, setFormData] = useState({
    location: "Sector 12, Mumbai",
    latitude: "",
    longitude: "",
    municipalCorp: "BMC",
    projectId: "PRJ-101",
    subject: "",
    description: "",
    image: null
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log("Submitting complaint:", formData);
    // Add API call logic here
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prevData => ({
          ...prevData,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
      });
    }
  };

  return (
    <div className="p-6 bg-white w-full">
      <div className="container px-0 mx-auto max-w-4xl">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-xl text-gray-500 gap-2 mb-8">
          <LayoutDashboard size={18} />
          <span>Projects</span>
          <ChevronRight size={16} />
          <span className="text-gray-500">PRJ-101</span>
          <ChevronRight size={16} />
          <span className="font-medium text-gray-800">File a New Complaint</span>
        </div>

        {/* Form Header */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">File a New Complaint</h1>
          <p className="text-gray-600">
            Use this form to report issues related to project PRJ-101: Metro Waterline Upgrade
          </p>
          <div className="flex items-center mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
            <Clock size={16} className="mr-2 flex-shrink-0" />
            <span>Complaints are typically reviewed within 24-48 hours</span>
          </div>
        </div>

        {/* Complaint Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          {/* Location */}
          <div className="mb-6">
            <label className="flex items-center text-gray-700 mb-2 font-medium">
              <MapPin size={18} className="mr-2 text-gray-600" />
              Location
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sector 12, Mumbai"
                />
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Latitude"
                  />
                </div>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Longitude"
                  />
                </div>
                <Button 
                  type="button" 
                  onClick={getCurrentLocation}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 flex items-center justify-center"
                  title="Get Current Location"
                >
                  <Crosshair size={18} />
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-1">
              Specify the exact location of the issue
            </p>
          </div>

          {/* Municipal Corp and Project ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="flex items-center text-gray-700 mb-2 font-medium">
                <Building size={18} className="mr-2 text-gray-600" />
                Municipal Corp
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="municipalCorp"
                  value={formData.municipalCorp}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="BMC"
                  readOnly
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="flex items-center text-gray-700 mb-2 font-medium">
                <FileSpreadsheet size={18} className="mr-2 text-gray-600" />
                Selected Project
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="PRJ-101"
                  readOnly
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="flex items-center text-gray-700 mb-2 font-medium">
              <PenTool size={18} className="mr-2 text-gray-600" />
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Complaint Title"
            />
            <p className="text-xs text-gray-500 mt-1 ml-1">
              Be specific and clear about the issue
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="flex items-center text-gray-700 mb-2 font-medium">
              <FileText size={18} className="mr-2 text-gray-600" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please provide detailed information about the issue you're experiencing. Include when you first noticed it and any relevant details that might help in resolving the problem."
            />
          </div>

          {/* Upload Images */}
          <div className="mb-8">
            <label className="flex items-center text-gray-700 mb-2 font-medium">
              <ImagePlus size={18} className="mr-2 text-gray-600" />
              Upload Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2">
                <Upload size={28} />
              </div>
              <p className="text-sm text-gray-600 mb-1">
                Drag and Drop file here or
              </p>
              <Button 
                type="button" 
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 text-sm"
              >
                Browse Files
              </Button>
              <input type="file" className="hidden" />
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">Accepted formats: JPEG, PNG</p>
              <p className="text-xs text-gray-500">Maximum size: 2MB</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button 
              type="button" 
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-md px-5 py-2 flex items-center gap-2"
            >
              <X size={16} />
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-5 py-2 flex items-center gap-2"
            >
              <Clipboard size={16} />
              Submit Complaint
            </Button>
          </div>
        </form>

        {/* Form Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 mt-4 mb-6">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <Info size={16} />
            <span>Current Time: 2025-03-21 06:01:02 (UTC)</span>
          </div>
          <div className="flex items-center gap-2">
            <span>User: Ammar2123</span>
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 text-sm mb-6 flex items-start">
          <HelpCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Need assistance?</p>
            <p>If you need help filing this complaint, please contact our support team at support@mumbai.gov.in or call our helpline at 1800-123-4567.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileComplaint;