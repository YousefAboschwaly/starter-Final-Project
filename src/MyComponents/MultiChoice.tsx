"use client";


import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface IService {
  id: number,
  code: string,
  name: string,
  nameAr: string,
  nameEn: string
}

interface MultiSelectProps {
  userServices: IService[];
  selectedServices: IService[];
  setSelectedServices: (services: IService[]) => void;
}

export default function MultiSelectOption({
  userServices,
  selectedServices,
  setSelectedServices,
}: MultiSelectProps) {

  const handleValueChange = (value: string) => {
    const selectedService = userServices.find((s) => s.id.toString() === value);
    if (!selectedService) return;
  
    const isAlreadySelected = selectedServices.some((s) => s.id === selectedService.id);
  
    setSelectedServices(
      isAlreadySelected
        ? selectedServices.filter((s) => s.id !== selectedService.id)
        : [...selectedServices, selectedService]
    );
  };
  
  
  
  

  const removeService = (serviceId: number) => {
    setSelectedServices(selectedServices.filter((s) => s.id !== serviceId));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="services">Services</Label>

      {/* Multi-Select Dropdown */}
      <Select onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Services" />
        </SelectTrigger>
        <SelectContent>
          {userServices.map((service) => (
            <SelectItem key={service.id} value={service.id.toString()}>
              {service.nameEn} {/* Display English Name */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Display Selected Services as Badges */}
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedServices.map((service) => (
          <Badge key={service.id} variant="secondary" className="px-2 py-1">
            {service.nameEn} {/* Display English Name */}
            <button onClick={() => removeService(service.id)} className="ml-1 hover:text-destructive">
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
