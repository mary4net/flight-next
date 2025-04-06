"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/hook/useUser";
import { useRouter } from "next/navigation";
import Navigation from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SimpleLabel } from "@/components/ui/simple-label";
import { SimpleTextarea } from "@/components/ui/simple-textarea";
import { SimpleSelect, SimpleSelectItem } from "@/components/ui/simple-select";
import { useSimpleToast } from "@/components/ui/use-simple-toast";

export default function AddHotelPage() {
  const { user } = useUser();
  const router = useRouter();
  const { toast, Toaster } = useSimpleToast();
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    address: "",
    city: "",
    starRating: "",
    images: "",
  });
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(true);

  // useEffect(() => {
  //   // Check if user is authenticated
  //   const checkAuth = async () => {
  //     try {
  //       const response = await fetch("/api/users/status", {
  //         method: "GET",
  //         credentials: "include",
  //       });
  //       if (!response.ok) {
  //         router.push("/user/login");
  //         return;
  //       }
  //       const data = await response.json();
  //       if (data.user.role !== "HOTEL_OWNER") {
  //         toast({
  //           title: "Error",
  //           description: "Only hotel owners can add hotels",
  //           variant: "destructive",
  //         });
  //         router.push("/");
  //         return;
  //       }
  //     } catch (error) {
  //       console.error("Auth check failed:", error);
  //       router.push("/user/login");
  //     }
  //   };
  //   checkAuth();
  // }, [router, toast]);
  //
  // useEffect(() => {
  //   if (user && user.role !== "HOTEL_OWNER") {
  //     toast({
  //       title: "Error",
  //       description: "Only hotel owners can add hotels",
  //       variant: "destructive",
  //     });
  //   }
  // }, [router, toast, user]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setCitiesLoading(true);
        const response = await fetch("/api/destinations/cities");
        if (!response.ok) {
          throw new Error("Failed to fetch cities");
        }
        const data = await response.json();
        console.log("Fetched cities:", data);
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast({
          title: "Error",
          description: "Failed to load cities. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setCitiesLoading(false);
      }
    };

    fetchCities();
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.address || !formData.city || !formData.starRating) {
        throw new Error("Please fill in all required fields");
      }

      // Parse images as JSON array
      const images = formData.images ? JSON.parse(formData.images) : [];

      const response = await fetch("/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          images,
          starRating: parseInt(formData.starRating),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add hotel");
      }

      toast({
        title: "Success",
        description: "Hotel added successfully!",
      });

      router.push("/hotel-management");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add hotel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add New Hotel</CardTitle>
              <CardDescription>Fill in the details to add a new hotel to your portfolio.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <SimpleLabel htmlFor="name" required>Hotel Name</SimpleLabel>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter hotel name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <SimpleLabel htmlFor="logo">Logo URL</SimpleLabel>
                  <Input
                    id="logo"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    placeholder="Enter logo URL"
                  />
                </div>

                <div className="space-y-2">
                  <SimpleLabel htmlFor="address" required>Address</SimpleLabel>
                  <SimpleTextarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter hotel address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <SimpleLabel htmlFor="city" required>City</SimpleLabel>
                  <SimpleSelect
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleSelectChange}
                    required
                    disabled={citiesLoading}
                  >
                    <SimpleSelectItem value="">Select a city</SimpleSelectItem>
                    {cities && cities.length > 0 ? (
                      cities.map((city) => (
                        <SimpleSelectItem key={city.city} value={city.city}>
                          {city.city}, {city.country}
                        </SimpleSelectItem>
                      ))
                    ) : (
                      <SimpleSelectItem value="" disabled>
                        {citiesLoading ? "Loading cities..." : "No cities available"}
                      </SimpleSelectItem>
                    )}
                  </SimpleSelect>
                  {citiesLoading && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Loading cities...
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <SimpleLabel htmlFor="starRating" required>Star Rating</SimpleLabel>
                  <SimpleSelect
                    id="starRating"
                    name="starRating"
                    value={formData.starRating}
                    onChange={handleSelectChange}
                    required
                  >
                    <SimpleSelectItem value="">Select star rating</SimpleSelectItem>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SimpleSelectItem key={rating} value={rating}>
                        {rating} {rating === 1 ? "Star" : "Stars"}
                      </SimpleSelectItem>
                    ))}
                  </SimpleSelect>
                </div>

                <div className="space-y-2">
                  <SimpleLabel htmlFor="images">Hotel Images (JSON array)</SimpleLabel>
                  <SimpleTextarea
                    id="images"
                    name="images"
                    value={formData.images}
                    onChange={handleInputChange}
                    placeholder='["image1.jpg", "image2.jpg"]'
                    helperText="Enter image URLs as a JSON array"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/hotel-management")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Hotel"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  );
} 
