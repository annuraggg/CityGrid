"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ax from "@/config/axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

import type IProject from "@/types/Project";

const Create = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState({
    address: "",
    latitude: 40.7128,
    longitude: -74.006,
  });

  // Map state
  const [mapCenter, setMapCenter] = useState({
    lat: 40.7128,
    lng: -74.006,
  });
  const [marker, setMarker] = useState({
    lat: 40.7128,
    lng: -74.006,
  });

  // Map styles
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  // Handle address selection
  const handleSelect = async (address: string) => {
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      setLocation({
        address,
        latitude: latLng.lat,
        longitude: latLng.lng,
      });
      setMapCenter({ lat: latLng.lat, lng: latLng.lng });
      setMarker({ lat: latLng.lat, lng: latLng.lng });
    } catch (error) {
      console.error("Error selecting address", error);
    }
  };

  // Handle map click for marker placement
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });
      setLocation({
        ...location,
        latitude: lat,
        longitude: lng,
      });
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      !description ||
      !startDate ||
      !endDate ||
      !location.latitude ||
      !location.longitude
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    // Prepare project data according to schema
    const projectData: IProject = {
      _id: "",
      name,
      manager: "", // This would typically come from auth context or be set by backend
      description,
      documents: [],
      resources: [],
      schedule: {
        start: startDate,
        end: endDate,
        isRescheduled: false,
      },
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    };

    try {
      await axios.post("/projects", projectData);
      toast.success("Project created successfully!");
      navigate("/project-manager/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Create New Project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Project Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className="w-full"
              required
            />
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              className="w-full min-h-[120px]"
              required
            />
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Start Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                End Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>

            <LoadScript
              googleMapsApiKey="AIzaSyBm-ngY7M7fqUalDnguMz82GNC7ThCQuYs" // Replace with your actual API key
              libraries={["places"]}
              key={"AIzaSyBb5hG4Lq5uDzepLc_Xn6kxM4mSEMe3dbw"}
            >
              {/* Location Search */}
              <PlacesAutocomplete
                value={location.address}
                onChange={(address) => setLocation({ ...location, address })}
                onSelect={handleSelect}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <div className="relative">
                    <Input
                      {...getInputProps({
                        placeholder: "Search for a location",
                        className: "w-full",
                      })}
                    />
                    <div className="absolute z-10 w-full bg-white shadow-lg rounded-b-md">
                      {loading && (
                        <div className="p-2 text-gray-500">Loading...</div>
                      )}
                      {suggestions.map((suggestion) => (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className: `p-2 cursor-pointer ${
                              suggestion.active ? "bg-blue-100" : "bg-white"
                            }`,
                          })}
                        >
                          {suggestion.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>

              {/* Map */}
              <div className="mt-4 rounded-lg overflow-hidden border border-gray-300">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={12}
                  onClick={handleMapClick}
                >
                  <Marker position={marker} />
                </GoogleMap>
              </div>

              {/* Coordinates Display */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Latitude
                  </label>
                  <Input
                    value={location.latitude.toString()}
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        latitude: parseFloat(e.target.value) || 0,
                      })
                    }
                    type="number"
                    step="0.000001"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Longitude
                  </label>
                  <Input
                    value={location.longitude.toString()}
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        longitude: parseFloat(e.target.value) || 0,
                      })
                    }
                    type="number"
                    step="0.000001"
                  />
                </div>
              </div>
            </LoadScript>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
