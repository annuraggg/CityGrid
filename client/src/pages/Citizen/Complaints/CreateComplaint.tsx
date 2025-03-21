import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronRight,
  ChevronLeft,
  Upload,
  MapPin,
  Building,
  FileText,
  CheckCircle2,
  HelpCircle,
  X,
  Clipboard,
  Info,
  ImagePlus,
  FileSpreadsheet,
  PenTool,
  LayoutDashboard,
  Crosshair,
  Clock,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const FileComplaint = () => {
  const [formData, setFormData] = useState({
    location: "",
    latitude: "",
    longitude: "",
    municipalCorp: "",
    projectId: "",
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
    <div className="w-full mx-auto px-6 py-8 space-y-8 max-w-7xl">
      {/* Breadcrumb */}

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center text-sm text-slate-500 gap-2 mb-2">
          <Link to="/citizen/" className="hover:text-indigo-600 flex items-center">
            <LayoutDashboard size={16} className="mr-1" />
            Dashboard
          </Link>
          <ChevronRight size={14} />
          <Link to="/citizen/projects/PRJ-101" className="hover:text-indigo-600">
            PRJ-101
          </Link>
          <ChevronRight size={14} />
          <span className="font-medium text-slate-700">New Complaint</span>
        </div>

        <h1 className="text-2xl font-semibold text-slate-900 mb-2">File a New Complaint</h1>
        <p className="text-slate-500">
          Use this form to report issues related to ongoing projects or any other complaints you may have.
        </p>
      </div>

      {/* Info Alert */}
      <Card className="border-amber-200 bg-amber-50 shadow-sm mb-6">
        <CardContent className="p-4 flex items-center gap-3">
          <Clock size={18} className="text-amber-600 shrink-0" />
          <p className="text-amber-700 text-sm">
            Complaints are typically reviewed within 24-48 hours
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card className="border-slate-200 shadow-sm mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900">Complaint Information</CardTitle>
            <CardDescription className="text-slate-500">
              Provide details about the issue you want to report
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-4">
            {/* Location */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <MapPin size={16} className="mr-2 text-slate-500" />
                Location
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Sector 12, Mumbai"
                  />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Latitude"
                    />
                  </div>
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Longitude"
                    />
                  </div>
                  <Button 
                    type="button" 
                    onClick={getCurrentLocation}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-indigo-600"
                    title="Get Current Location"
                  >
                    <Crosshair size={16} />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1 ml-1">
                Specify the exact location of the issue
              </p>
            </div>

            {/* Municipal Corp and Project ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <Building size={16} className="mr-2 text-slate-500" />
                  Municipal Corporation
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    name="municipalCorp"
                    value={formData.municipalCorp}
                    onChange={handleChange}
                    className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                    placeholder="Please provide the name of the municipal corporation"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <FileSpreadsheet size={16} className="mr-2 text-slate-500" />
                  Selected Project
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleChange}
                    className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                    placeholder="Please provide the project ID"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Subject */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <PenTool size={16} className="mr-2 text-slate-500" />
                Subject
              </label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Complaint Title"
              />
              <p className="text-xs text-slate-500 mt-1 ml-1">
                Be specific and clear about the issue
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <FileText size={16} className="mr-2 text-slate-500" />
                Description
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="min-h-32 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-slate-700 resize-none"
                placeholder="Please provide detailed information about the issue you're experiencing. Include when you first noticed it and any relevant details that might help in resolving the problem."
              />
            </div>

            {/* Upload Images */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <ImagePlus size={16} className="mr-2 text-slate-500" />
                Upload Images
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-md p-8 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400 mb-2">
                  <Upload size={28} />
                </div>
                <p className="text-sm text-slate-600 mb-1">
                  Drag and Drop file here or
                </p>
                <Button 
                  type="button" 
                  className="bg-indigo-600 hover:bg-indigo-700 h-9 px-4 text-sm font-medium"
                >
                  Browse Files
                </Button>
                <input type="file" className="hidden" />
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-slate-500">Accepted formats: JPEG, PNG</p>
                <p className="text-xs text-slate-500">Maximum size: 2MB</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-6 border-t border-slate-100">
            <Link to="/citizen/complaints">
              <Button 
                type="button" 
                variant="outline"
                className="text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-4 text-sm font-medium"
              >
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium"
            >
              <Clipboard size={16} className="mr-2" />
              Submit Complaint
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Help Box */}
      <Card className="border-indigo-200 bg-indigo-50 shadow-sm mb-6">
        <CardContent className="p-4 flex items-start gap-3">
          <HelpCircle size={18} className="text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1 text-indigo-700">Need assistance?</p>
            <p className="text-sm text-indigo-600">
              If you need help filing this complaint, please contact our support team at support@mumbai.gov.in or call our helpline at 1800-123-4567.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileComplaint;