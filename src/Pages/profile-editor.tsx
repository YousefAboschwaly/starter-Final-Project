import type React from "react";
import { useState, useRef, useContext, useEffect, type FormEvent } from "react";
import {
  ChevronLeft,
  Briefcase,
  User,
  Link2,
  Mail,
  Phone,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MultiSelectOption from "../MyComponents/MultiChoice";
import { UserContext } from "@/Contexts/UserContext";
import { ImageUpload } from "@/MyComponents/image-upload";
import { IUser } from "@/interfaces";

const defaultObj: IUser = {
  id: null,
  user: {
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: null,
    personalPhoto: null,
    password: "",
    userType: {
      id: null,
      code: "",
      name: null,
    },
    governorate: {
      id: null,
      code: "",
      name: null,
    },
    city: {
      id: null,
      code: "",
      name: null,
    },
    engineer: null,
    engineeringOffice: null,
    technicalWorker: null,
    enabled: true,
  },
  type: {
    id: null,
    code: "",
    name: "",
    nameAr: "",
    nameEn: "",
  },
  yearsOfExperience: null,
  engineerServ: [],
  bio: null,
  linkedin: null,
  behance: null,
};

interface IUserType {
  id: number;
  code: string;
  name: string;
  nameAr: string;
  nameEn: string;
}

const ProfileEditor = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { userId, userToken, pathUrl } = userContext;

  const [activeTab, setActiveTab] = useState("basic");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added loading state

  // Form Data
  const [tempDta, setTempDta] = useState<IUser>(defaultObj);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState<number | null>(
    null
  );
  const [governates, setGovernates] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedGovernorate, setSelectedGovernorate] = useState<{
    id: number | null;
    name: string;
  } | null>(null);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState<{
    id: number | null;
    name: string;
  } | null>(null);

  const [userTypes, setUserTypes] = useState<IUserType[]>([]);
  const [selectedUserType, setSelectedUserType] = useState<IUserType | null>(
    null
  );
  const [userServices, setUserServices] = useState<IUserType[]>([]);
  const [selectedUserServices, setSelectedUserServices] = useState<IUserType[]>(
    []
  );
  const [bio, setBio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [behance, setBehance] = useState("");
  const [personalPhoto, setPersonalPhoto] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  );
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    yearsOfExperience: "",
    city: "",
    userServices: "",
    linkedin: "",
    behance: "",
    personalPhoto: "",
  });

  console.log("DAta From API", tempDta);

  let user_type = localStorage.getItem("user-type");
  // Ensure user_type is a valid string before replacing spaces
  user_type = user_type ? user_type.replace(/\s+/g, "-") : null;


  const basicRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const targetElement = document.getElementById(id);
    if (targetElement) {
      const yOffset = -80;
      const y =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const NavButton = ({
    id,
    label,
    icon: Icon,
  }: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <Button
      variant={activeTab === id ? "secondary" : "ghost"}
      className="w-full justify-start mb-1"
      onClick={() => scrollToSection(id)}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );

  const SidebarContent = () => (
    <nav className="space-y-1 p-2">
      <NavButton id="basic" label="Basic Information" icon={User} />
      <NavButton id="bio" label="Bio" icon={Briefcase} />
      <NavButton id="links" label="Links" icon={Link2} />
    </nav>
  );

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^01[0125][0-9]{8}/;
    return re.test(phone);
  };

  const validateUrl = (url: string) => {
    const re = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return re.test(url);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    } else {
      newErrors.firstName = "";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    } else {
      newErrors.lastName = "";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    } else {
      newErrors.email = "";
    }

    if (phone && !validatePhone(phone)) {
      newErrors.phone = "Invalid phone number format";
      isValid = false;
    } else {
      newErrors.phone = "";
    }

    if (!yearsOfExperience) {
      newErrors.yearsOfExperience = "Years of experience is required";
      isValid = false;
    } else if (yearsOfExperience < 0) {
      newErrors.yearsOfExperience = "Years of experience cannot be negative";
      isValid = false;
    } else {
      newErrors.yearsOfExperience = "";
    }

    if (selectedGovernorate?.id && !selectedCity?.id) {
      newErrors.city = "City is required when governorate is selected";
      isValid = false;
    } else {
      newErrors.city = "";
    }

    if (selectedUserServices.length === 0) {
      newErrors.userServices = "At least one service is required";
      isValid = false;
    } else {
      newErrors.userServices = "";
    }

    if (linkedin && !validateUrl(linkedin)) {
      newErrors.linkedin = "Invalid LinkedIn URL";
      isValid = false;
    } else {
      newErrors.linkedin = "";
    }

    if (behance && !validateUrl(behance)) {
      newErrors.behance = "Invalid Behance URL";
      isValid = false;
    } else {
      newErrors.behance = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirmEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const dataToSend: IUser = {
      id: tempDta.id,
      user: {
        id: tempDta.user.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        personalPhoto: tempDta.user.personalPhoto,
        password: tempDta.user.password,
        userType: tempDta.user.userType,
        engineer: tempDta.user.engineer,
        technicalWorker: tempDta.user.technicalWorker,
        engineeringOffice: tempDta.user.engineeringOffice,
        enabled: tempDta.user.enabled,
        governorate: selectedGovernorate
          ? {
              id: selectedGovernorate.id,
              code: selectedGovernorate.name.toUpperCase(),
              name: selectedGovernorate.name,
            }
          : undefined,
        city: selectedCity
          ? {
              id: selectedCity.id,
              code: selectedCity.name.toUpperCase(),
              name: selectedCity.name,
            }
          : undefined,
      },
      type: selectedUserType || tempDta.type,
      yearsOfExperience: yearsOfExperience || 0,
      bio: bio ? bio.trim() : null,
      linkedin: linkedin ? linkedin.trim() : null,
      behance: behance ? behance.trim() : null,
    };

    if (tempDta.user.userType.code.toLowerCase() === "engineer") {
      dataToSend.engineerServ = selectedUserServices;
    } else if (
      tempDta.user.userType.code.toLowerCase() === "technical_worker"
    ) {
      dataToSend.workerServs = selectedUserServices;
    }

    const cleanDataToSend = JSON.parse(JSON.stringify(dataToSend));

    console.log("Data to send to API ---->", cleanDataToSend);

    try {
      // Update profile
      const apiUrl =
        tempDta.user.userType.code === "ENGINEER"
          ? `${pathUrl}/api/v1/engineers`
          : `${pathUrl}/api/v1/technical-workers`;

      const response = await axios.put(`${apiUrl}`, cleanDataToSend, {
        headers: {
          "Accept-Language": "en",
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        // Upload personal photo
        if (personalPhoto) {
          const formData = new FormData();
          formData.append("image", personalPhoto);

          const photoUploadResponse = await axios.post(
            `${pathUrl}/api/v1/users/personal_photo`,
            formData,
            {
              headers: {
                "Accept-Language": "en",
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (photoUploadResponse.data.success) {
            toast.success("Profile updated successfully!", {
              duration: 2000,
              position: "top-center",
            });

            setTimeout(() => {
              navigate("/profile");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }, 2000);
          } else {
            toast.error("Failed to upload personal photo. Please try again.");
          }
        } else {
          toast.success("Profile updated successfully!", {
            duration: 2000,
            position: "top-center",
          });

          setTimeout(() => {
            navigate("/profile");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("API Error Response:", error.response.data);
        toast.error(
          `Failed to update profile: ${
            error.response.data.message || "Please try again."
          }`
        );
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getUserData() {
      try {
        const { data } = await axios.get(
          `${pathUrl}/api/v1/${user_type}s/user?userId=${
            userId || localStorage.getItem("user-id")
          }`,
          {
            headers: {
              "Accept-Language": "en",
              Authorization: `Bearer ${userToken}`,
            },
            signal,
          }
        );

        // Batch state updates
        setTempDta((prev) => ({ ...prev, ...data.data }));
        setFirstName(data.data.user.firstName);
        setLastName(data.data.user.lastName);
        setPhone(data.data.user.phone === "null" ? "" : data.data.user.phone);
        setEmail(data.data.user.email);
        setSelectedGovernorate({
          id: data.data.user.governorate?.id,
          name: data.data.user.governorate?.code.toLowerCase(),
        });
        setSelectedCity(
          tempDta.user.city
            ? {
                id: tempDta.user.city.id ?? null,
                name: tempDta.user.city.code
                  ? tempDta.user.city.code.toLowerCase()
                  : "",
              }
            : null
        );

        setYearsOfExperience(data.data.yearsOfExperience);
        setSelectedUserType(data.data.type || null);
        setSelectedUserServices(
          data.data.engineerServ ?? data.data.workerServs ?? []
        );
        setBio(data.data.bio || "");
        setLinkedin(data.data.linkedin || "");
        setBehance(data.data.behance || "");

        // Set city only once from initial data
        setSelectedCity(
          data.data.user.city
            ? {
                id: data.data.user.city.id ?? null,
                name: data.data.user.city.code
                  ? data.data.user.city.code.toLowerCase()
                  : "",
              }
            : null
        );

        // Set preview image if exists
        if (data.data.user.personalPhoto) {
          // Construct the image URL directly
          const imageUrl = `${pathUrl}/${data.data.user.personalPhoto}`;
          setPreviewImage(imageUrl);
        } else {
          setPreviewImage(undefined);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, userToken, user_type, pathUrl]); // Added tempDta.user.city to dependencies

  useEffect(() => {
    if (tempDta?.user.governorate) {
      setSelectedGovernorate({
        id: tempDta?.user.governorate.id,
        name: tempDta?.user.governorate.code.toLowerCase() ?? "",
      });

      setGovernates([
        {
          id: tempDta?.user.governorate.id ?? 0,
          name: tempDta?.user.governorate.name ?? "",
        },
      ]);
    }

    const controller = new AbortController();
    const signal = controller.signal;

    async function getGovernates() {
      try {
        const { data } = await axios.get(`${pathUrl}/api/v1/governorates`, {
          headers: {
            "Accept-Language": "en",
          },
          signal,
        });
        setGovernates(data.data);
      } catch (error) {
        console.log(error);
      }
    }

    getGovernates();

    return () => {
      controller.abort();
    };
  }, [pathUrl, tempDta?.user.governorate]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    // Set city from API data first
    if (selectedGovernorate?.id !== tempDta.user.governorate?.id) {
      setSelectedCity(null);
    } else {
      setSelectedCity(
        tempDta.user.city
          ? {
              id: tempDta.user.city.id ?? null,
              name: tempDta.user.city.code
                ? tempDta.user.city.code.toLowerCase()
                : "",
            }
          : null
      );
    }

    async function getCity() {
      try {
        const { data } = await axios.get(
          `${pathUrl}/api/v1/cities/governorate/${selectedGovernorate?.id}`,
          {
            headers: {
              "Accept-Language": "en",
            },
            signal,
          }
        );
        setCities(data.data);
      } catch (error) {
        console.log(error);
      }
    }

    if (selectedGovernorate?.id) {
      getCity();
    }

    return () => {
      controller.abort();
    };
  }, [
    pathUrl,
    selectedGovernorate?.id,
    tempDta.user.city,
    tempDta.user.governorate?.id,
  ]); // Added tempDta.user.city to dependencies

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const type =
      tempDta?.user.userType.code.toLowerCase().replace(/_/g, "-") + "-types";
    async function getUserType() {
      try {
        const { data } = await axios.get(`${pathUrl}/api/v1/${type}`, {
          headers: {
            "Accept-Language": "en",
          },
          signal,
        });
        setUserTypes(data.data);
      } catch (error) {
        console.log(error);
      }
    }

    getUserType();

    return () => {
      controller.abort();
    };
  }, [pathUrl, tempDta?.user.userType.code]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (selectedUserType?.id !== tempDta.type?.id) {
      setSelectedUserServices([]);
    } else {
      setSelectedUserServices(
        tempDta.user.userType.code.toLowerCase() === "engineer"
          ? tempDta.engineerServ ?? []
          : tempDta.workerServs ?? []
      );
    }
    const type = tempDta?.user.userType.code.toLowerCase().replace(/_/g, "-");
    async function getUserServices() {
      try {
        const { data } = await axios.get(
          `${pathUrl}/api/v1/${type}-services/service/${selectedUserType?.id}`,
          {
            headers: {
              "Accept-Language": "en",
              Authorization: `Bearer ${userToken}`,
            },
            signal,
          }
        );
        setUserServices(data.data);
      } catch (error) {
        console.log(error);
      }
    }

    if (selectedUserType?.id) {
      getUserServices();
    }

    return () => {
      controller.abort();
    };
  }, [pathUrl, selectedUserType?.id, tempDta, userToken]); // Added tempDta to dependencies

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8 pt-20">
      <div className="md:hidden fixed top-14 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 py-4 px-4 md:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to={"/profile"}>
            <Button
              variant="ghost"
              className="hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to profile
            </Button>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[280px]">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Toaster />
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[240px,1fr] gap-6">
          <Card className="h-fit backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 sticky top-28 shadow-lg hidden md:block">
            <Link
              to={"/profile"}
              className="secondary-grad rounded-md hidden md:block"
            >
              <Button
                variant="ghost"
                className="hover:bg-transparent backdrop-blur-sm w-full justify-start"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ChevronLeft className="w-4 h-4 mr-4" />
                Back to profile
              </Button>
            </Link>
            <SidebarContent />
          </Card>

          <form onSubmit={handleConfirmEdit}>
            <div className="space-y-6">
              <Card
                ref={basicRef}
                id="basic"
                className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg overflow-hidden pt-20"
              >
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-[200px,1fr] gap-8">
                    <div className="flex flex-col items-center space-y-4 mx-auto md:mx-0">
                      <div className="flex flex-col items-center gap-3">
                        <ImageUpload
                          defaultImage={previewImage}
                          onChange={(file) => {
                            if (file) {
                              setPersonalPhoto(file);
                              const imageUrl = URL.createObjectURL(file);
                              setPreviewImage(imageUrl);
                            } else {
                              setPersonalPhoto(null);
                              setPreviewImage(undefined);
                            }
                            setErrors((prev) => ({
                              ...prev,
                              personalPhoto: "",
                            }));
                          }}
                          className="w-32 h-32 md:w-40 md:h-40"
                        />
                        <span className="text-sm text-muted-foreground">
                          Click to change profile picture
                        </span>
                      </div>
                      {errors.personalPhoto && (
                        <p className="text-red-500 text-sm">
                          {errors.personalPhoto}
                        </p>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="Enter first name"
                            className={`mt-1 ${
                              errors.firstName ? "border-red-500" : ""
                            }`}
                            value={firstName}
                            onChange={(e) => {
                              setFirstName(e.target.value);
                              setErrors((prev) => ({ ...prev, firstName: "" }));
                            }}
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.firstName}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Enter last name"
                            className={`mt-1 ${
                              errors.lastName ? "border-red-500" : ""
                            }`}
                            value={lastName}
                            onChange={(e) => {
                              setLastName(e.target.value);
                              setErrors((prev) => ({ ...prev, lastName: "" }));
                            }}
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className={`pl-10 mt-1 ${
                              errors.email ? "border-red-500" : ""
                            }`}
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setErrors((prev) => ({ ...prev, email: "" }));
                            }}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter phone number"
                            className={`pl-10 mt-1 ${
                              errors.phone ? "border-red-500" : ""
                            }`}
                            value={phone ?? ""} // Update 2: Handle null phone values
                            onChange={(e) => {
                              setPhone(e.target.value);
                              setErrors((prev) => ({ ...prev, phone: "" }));
                            }}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="governate">Governate</Label>
                        <Select
                          value={selectedGovernorate?.id?.toString() ?? ""}
                          onValueChange={(id) => {
                            const selected = governates.find(
                              (gov) => gov.id.toString() === id
                            );

                            // Ensure selectedGovernorate is not null before comparing IDs
                            if (
                              selected &&
                              selectedGovernorate?.id !== selected.id
                            ) {
                              setSelectedCity(null);
                            }

                            setSelectedGovernorate((prev) =>
                              selected
                                ? { id: selected.id, name: selected.name }
                                : prev
                            );

                            setErrors((prev) => ({ ...prev, city: "" }));
                          }}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select governorate" />
                          </SelectTrigger>
                          <SelectContent>
                            {governates.map((gover) => (
                              <SelectItem
                                key={gover.id}
                                value={gover.id.toString()}
                              >
                                {gover.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="city">City</Label>
                        <Select
                          value={
                            selectedCity?.id?.toString() ||
                            tempDta.user.city?.id?.toString()
                          }
                          onValueChange={(id) => {
                            const selected = cities.find(
                              (city) => city.id.toString() === id
                            );
                            setSelectedCity((prev) =>
                              selected
                                ? { id: selected.id, name: selected.name }
                                : prev
                            );
                            setErrors((prev) => ({ ...prev, city: "" }));
                          }}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem
                                key={city.id}
                                value={city.id.toString()}
                              >
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input
                          id="experience"
                          type="text"
                          placeholder="Enter years of experience"
                          className={`mt-1 ${
                            errors.yearsOfExperience ? "border-red-500" : ""
                          }`}
                          value={yearsOfExperience?.toString() ?? ""}
                          onChange={(e) => {
                            const value = e.target.value
                              ? Number.parseInt(e.target.value)
                              : null;
                            setYearsOfExperience(value);
                            setErrors((prev) => ({
                              ...prev,
                              yearsOfExperience: "",
                            }));
                          }}
                        />
                        {errors.yearsOfExperience && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.yearsOfExperience}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="type">
                          {tempDta?.user.userType.code.toLowerCase() + " type"}
                        </Label>
                        <Select
                          value={
                            selectedUserType?.id?.toString() ??
                            tempDta?.type?.id?.toString() ??
                            ""
                          }
                          onValueChange={(id) => {
                            const selected = userTypes.find(
                              (userType) => userType.id.toString() === id
                            );
                            if (
                              selected &&
                              selectedUserType?.id !== selected.id
                            ) {
                              setSelectedUserServices([]);
                            }

                            setSelectedUserType((prev) =>
                              selected ? selected : prev
                            );
                          }}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Engineer Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {userTypes.map((userType) => (
                              <SelectItem
                                key={userType.id}
                                value={userType.id.toString()}
                              >
                                {userType.nameEn}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <MultiSelectOption
                          userServices={userServices}
                          selectedServices={selectedUserServices}
                          setSelectedServices={(services) => {
                            setSelectedUserServices(services);
                            setErrors((prev) => ({
                              ...prev,
                              userServices: "",
                            }));
                          }}
                        />
                        {errors.userServices && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.userServices}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                ref={bioRef}
                id="bio"
                className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg pt-20"
              >
                <CardHeader>
                  <h2 className="text-xl font-semibold">Bio</h2>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    className="min-h-[150px]"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </CardContent>
              </Card>

              <Card
                ref={linksRef}
                id="links"
                className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg pt-20"
              >
                <CardHeader>
                  <h2 className="text-xl font-semibold">Links</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="linkedin">LinkedIn Profile</Label>
                      <Input
                        id="linkedin"
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        className={`mt-1 ${
                          errors.linkedin ? "border-red-500" : ""
                        }`}
                        value={linkedin}
                        onChange={(e) => {
                          setLinkedin(e.target.value);
                          setErrors((prev) => ({ ...prev, linkedin: "" }));
                        }}
                      />
                      {errors.linkedin && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.linkedin}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="behance">Behance Profile</Label>
                      <Input
                        id="behance"
                        type="url"
                        placeholder="https://behance.net/username"
                        className={`mt-1 ${
                          errors.behance ? "border-red-500" : ""
                        }`}
                        value={behance}
                        onChange={(e) => {
                          setBehance(e.target.value);
                          setErrors((prev) => ({ ...prev, behance: "" }));
                        }}
                      />
                      {errors.behance && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.behance}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-lg font-semibold shadow-lg transition-all duration-200 ease-in-out hover:scale-105"
                  disabled={
                    Object.values(errors).some((error) => error !== "") ||
                    isSubmitting
                  }
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Confirm...</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    </>
                  ) : (
                    "Confirm Edit"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
