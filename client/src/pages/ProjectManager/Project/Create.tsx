"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { 
  CalendarIcon, 
  ChevronLeft, 
  MapPin, 
  Check, 
  FileText, 
  Building, 
  PlusCircle,
  Clock,
  Calendar as CalendarFull, 
  SquarePen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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
    borderRadius: "0.5rem",
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
    <div className="w-full mx-auto px-6 py-8 space-y-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link to="/project-manager/projects" className="text-sm text-slate-600 hover:text-indigo-600 flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Projects
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Create New Project</h1>
        <p className="text-slate-500">Add a new project with details, timeline, and location information</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-600" />
            Project Information
          </CardTitle>
          <CardDescription className="text-slate-500">
            Fill in the basic details of your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Project Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                className="w-full border-slate-200 focus:border-indigo-500 h-10"
                required
              />
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-slate-700"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
                className="w-full min-h-[120px] border-slate-200 focus:border-indigo-500"
                required
              />
            </div>

            <Separator className="my-6 bg-slate-100" />

            {/* Schedule Section */}
            <div className="space-y-4">
              <div className="flex items-center mb-2">
                <CalendarFull className="h-5 w-5 text-slate-600 mr-2" />
                <h3 className="text-base font-medium text-slate-800">Project Timeline</h3>
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Start Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-slate-700 border-slate-200 hover:bg-slate-50 h-10",
                          !startDate && "text-slate-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                        {startDate ? format(startDate, "PPP") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-slate-200">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        classNames={{
                          day_selected: "bg-indigo-600 text-white hover:bg-indigo-600 focus:bg-indigo-600",
                          day_today: "bg-slate-100 text-slate-900",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    End Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-slate-700 border-slate-200 hover:bg-slate-50 h-10",
                          !endDate && "text-slate-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                        {endDate ? format(endDate, "PPP") : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-slate-200">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => (startDate ? date < startDate : false)}
                        classNames={{
                          day_selected: "bg-indigo-600 text-white hover:bg-indigo-600 focus:bg-indigo-600",
                          day_today: "bg-slate-100 text-slate-900",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <Separator className="my-6 bg-slate-100" />

            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-slate-600 mr-2" />
                <h3 className="text-base font-medium text-slate-800">Project Location</h3>
              </div>

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
                    loading: searchLoading,
                  }) => (
                    <div className="relative">
                      <div className="flex items-center mb-2">
                        <Label className="text-sm font-medium text-slate-700">
                          Search for Location
                        </Label>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-slate-400" />
                        </div>
                        <Input
                          {...getInputProps({
                            placeholder: "Enter an address or location",
                            className: "pl-10 border-slate-200 focus:border-indigo-500 h-10",
                          })}
                        />
                      </div>
                      <div className="absolute z-10 w-full bg-white shadow-lg rounded-md border border-slate-200 mt-1">
                        {searchLoading && (
                          <div className="p-3 text-slate-500 text-sm">Loading...</div>
                        )}
                        {suggestions.map((suggestion) => (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className: `p-3 cursor-pointer text-sm border-b border-slate-100 last:border-b-0 ${
                                suggestion.active 
                                  ? "bg-indigo-50 text-indigo-700" 
                                  : "bg-white text-slate-700 hover:bg-slate-50"
                              }`,
                            })}
                          >
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-slate-500 mr-2 flex-shrink-0" />
                              <span>{suggestion.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>

                {/* Map */}
                <div className="mt-6 rounded-lg overflow-hidden border border-slate-200">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={12}
                    onClick={handleMapClick}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: true,
                      zoomControl: true,
                      styles: [
                        {
                          featureType: "administrative",
                          elementType: "geometry",
                          stylers: [{ visibility: "on" }],
                        },
                      ],
                    }}
                  >
                    <Marker position={marker} />
                  </GoogleMap>

                  <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
                    Click on the map to set a precise location
                  </div>
                </div>

                {/* Coordinates Display */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Latitude
                    </Label>
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
                      className="border-slate-200 focus:border-indigo-500 h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Longitude
                    </Label>
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
                      className="border-slate-200 focus:border-indigo-500 h-10"
                    />
                  </div>
                </div>
              </LoadScript>
            </div>

            <Separator className="my-6 bg-slate-100" />

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                className="text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-4 text-sm font-medium"
                onClick={() => navigate("/project-manager/projects")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium"
                disabled={loading}
              >
                {loading ? (
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <SquarePen className="h-4 w-4 mr-2" />
                )}
                {loading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Create;
