import { useCallback, useContext, useEffect, useState } from "react";
import { MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddCertificateDialog } from "./add-certificate-dialog";
import { EditCertificateDialog } from "./edit-certificate-dialog";
import { AddServiceDialog } from "./add-service-dialog";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "@/Contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/interfaces";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export interface EngineerType {
  id: number;
  code: string;
  name: string;
  nameAr: string;
  nameEn: string;
}

export function Sidebar() {
  const [isCertificationsDialogOpen, setIsCertificationsDialogOpen] = useState(false);
  const [isCertificationsEditDialogOpen, setIsCertificationsEditDialogOpen] = useState(false);
  const [isDeleteCertDialogOpen, setIsDeleteCertDialogOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<{
    id: number;
    name: string;
    path: string;
    description: string;
  } | null>(null);
  const [certifications, setCertifications] = useState<Array<{ id: number; name: string; path: string; description: string }>>([]);

  const [isServicesDialogOpen, setIsServicesDialogOpen] = useState(false);
  const [selectedServ, setSelectedServ] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isDeleteServDialogOpen, setIsDeleteServDialogOpen] = useState(false);

  const [, setIsLoadingUserData] = useState(true); // Loading state

  const handleAddService = () => {
    query.refetch();
  };

  let user_type = localStorage.getItem("user-type");
  user_type = user_type ? user_type.replace(/\s+/g, "-") : null;
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { userId, userToken, pathUrl } = userContext;

  const handleAddCertificates = (certificate: { id: number; name: string; description: string; path: string }) => {
    setCertifications((prev) => [...prev, certificate]);
    getCertifications();
  };

  const fetchCertificateData = async (id: number) => {
    try {
      const response = await axios.get(
        `${pathUrl}/api/v1/certificate/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const data = response.data.data;
      setSelectedCert({
        id: data.id,
        name: data.name,
        path: data.path,
        description: data.description,
      });
      setIsCertificationsEditDialogOpen(true);
    } catch (error) {
      console.error("Error fetching certification data:", error);
    }
  };

  const handleEditClick = (certId: number) => {
    fetchCertificateData(certId);
  };

  const handleDeleteCert = async () => {
    if (!selectedCert) {
      console.error("Error: No valid certification selected for deletion.");
      return;
    }

    try {
      setCertifications((prev) =>
        prev.filter((cert) => cert.id !== selectedCert.id)
      );

      await axios.delete(
        `${pathUrl}/api/v1/certificate/${selectedCert.id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      setIsDeleteCertDialogOpen(false);
      getCertifications();
    } catch (error) {
      console.error("Error deleting certification:", error);
    }
  };

  const getUserData = async () => {
    setIsLoadingUserData(true); // Set loading to true before fetching data
    const response = await axios.get(
      `${pathUrl}/api/v1/${user_type}s/user?userId=${userId || localStorage.getItem("user-id")}`,
      {
        headers: {
          "Accept-Language": "en",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    setIsLoadingUserData(false); // Set loading to false after data is fetched
    return response;
  };

  const getCertifications = useCallback(async () => {
    if (!userToken) {
      throw new Error("User token is missing!");
    }

    try {
      const response = await axios.get(`${pathUrl}/api/v1/certificate/user-certificates`, {
        headers: {
          "Accept-Language": "en",
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (Array.isArray(response.data.data)) {
        setCertifications(response.data.data);
      } else {
        console.error("Certifications data is not an array:", response.data);
      }
    } catch (error) {
      console.error("API Error:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || error.message);
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }, [userToken, pathUrl]);

  const handleDeleteServ = async () => {
    if (!selectedServ) {
      console.error("Error: No valid service selected for deletion.");
      return;
    }

    try {
      await axios.delete(
        `${pathUrl}/api/v1/${user_type}-services/service?${user_type === 'technical-worker' ? 'workerId' : 'engineerId'}=${userData?.id}&serviceId=${selectedServ.id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setIsDeleteServDialogOpen(false);
      query.refetch();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  useEffect(() => {
    getCertifications();
  }, [userToken, pathUrl, getCertifications]);

  useEffect(() => {
    // Reset state when userId or userToken changes
    setCertifications([]);
    setSelectedCert(null);
    setSelectedServ(null);
  }, [userId, userToken]);

  const query = useQuery<{ data: { data: IUser } }, Error, IUser>({
    queryKey: ['AllUserData', localStorage.getItem("user-id")],
    queryFn: getUserData,
    select: (data) => data.data.data,
  });

  const { data: userData, isLoading } = query;
  const { firstName, lastName, personalPhoto } = userData?.user || {};
  const { name } = userData?.type || {};
  const { bio, linkedin, behance, engineerServ, workerServs } = userData || {};
  const services = engineerServ ? engineerServ : workerServs ? workerServs : [];

  if (isLoading ) {
    return <div>Loading...</div>; // Show a loading state
  }

  return (
    <div className="relative w-full shrink-0 bg-white pt-24 md:w-[320px]" key={userId}>
      {/* Use the propUserId as a key to force remount when it changes */}
      <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 transform">
        <div className="h-full w-full overflow-hidden rounded-full border-4 border-white">
          {personalPhoto ? (
            <img
              src={`${pathUrl}/api/v1/file/download?fileName=${personalPhoto}&t=${new Date().getTime()}`}
              alt="Profile"
              width={180}
              height={180}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-200">
              Loading...
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center space-y-2 p-4 pt-0">
        <h2 className="text-base font-medium">{firstName} {lastName}</h2>
        <p className="text-sm text-gray-500">{name}</p>
        <div className="flex">
          {"★★★★☆".split("").map((star, i) => (
            <span key={i} className="text-yellow-400 text-[20px]">
              {star}
            </span>
          ))}
        </div>
        <Link to="/edit_profile">
          <Button variant="outline" size="sm" className="mt-2 w-full rounded-lg text-[18px] py-5 primary-grad hover:text-white">
            Edit Profile
          </Button>
        </Link>
      </div>

      <div className="space-y-4 p-4">
        <div className="rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md">
          <h3 className="text-sm font-medium">Links</h3>
          <div className="mt-2 space-y-1 text-sm text-gray-500 flex flex-col">
            {!linkedin && !behance ? (
              "No Available Links"
            ) : (
              <>
                {linkedin && <a href={linkedin} target="_blank" className="truncate">{linkedin}</a>}
                {behance && <a href={behance} target="_blank" className="truncate">{behance}</a>}
              </>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md">
          <h3 className="text-sm font-medium">Bio</h3>
          <div className="mt-2 text-sm text-gray-600">
            {bio ? bio : "No Available Bio"}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Services</h3>
            <button
              onClick={() => setIsServicesDialogOpen(true)}
              className="flex items-center text-xs text-gray-500 transition-colors hover:text-primary"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Services
            </button>
          </div>
          <ul className="mt-2 space-y-2">
            {services.map((service, i) => (
              <li key={i} className="flex items-center justify-between text-sm text-gray-600">
                <span>• {service.name}</span>
                <button
                  onClick={() => {
                    setIsDeleteServDialogOpen(true);
                    setSelectedServ(service);
                  }}
                  className="p-1 transition-colors hover:text-primary"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Certifications</h3>
            <button
              onClick={() => setIsCertificationsDialogOpen(true)}
              className="flex items-center text-xs text-gray-500 transition-colors hover:text-primary"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Certifications
            </button>
          </div>
          <ul className="mt-2 space-y-2">
            {Array.isArray(certifications) && certifications.map((cert, i) => (
              <li key={i} className="flex items-center justify-between text-sm text-gray-600">
                <span>• {cert.name}</span>
                <div className="relative flex space-x-2">
                  <button
                    onClick={() => handleEditClick(cert.id)}
                    className="p-1 transition-colors hover:text-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteCertDialogOpen(true);
                      setSelectedCert(cert);
                    }}
                    className="p-1 transition-colors hover:text-primary"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <AddCertificateDialog
        open={isCertificationsDialogOpen}
        onOpenChange={setIsCertificationsDialogOpen}
        onAdd={handleAddCertificates}
      />
      <EditCertificateDialog
        open={isCertificationsEditDialogOpen}
        onOpenChange={setIsCertificationsEditDialogOpen}
        selectedCert={selectedCert}
        onEdit={(updatedCert) => {
          setCertifications((prev) =>
            prev.map((cert) =>
              cert.id === updatedCert.id ? updatedCert : cert
            )
          );
        }}
      />
      <AddServiceDialog
        open={isServicesDialogOpen}
        onOpenChange={setIsServicesDialogOpen}
        onAdd={handleAddService}
        userData={userData}
      />

      <Dialog
        open={isDeleteCertDialogOpen}
        onOpenChange={setIsDeleteCertDialogOpen}
      >
        <DialogContent className="max-w-sm p-6">
          <h2 className="text-xl font-semibold">Delete Certification</h2>
          <p className="mt-4">
            Are you sure you want to delete this certification?
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              onClick={() => setIsDeleteCertDialogOpen(false)}
              variant="ghost"
              className="bg-white hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteCert}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteServDialogOpen}
        onOpenChange={setIsDeleteServDialogOpen}
      >
        <DialogContent className="max-w-sm p-6">
          <h2 className="text-xl font-semibold">Delete Services</h2>
          <p className="mt-4">Are you sure you want to delete this service?</p>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              onClick={() => setIsDeleteServDialogOpen(false)}
              variant="ghost"
              className="bg-white hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteServ}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


