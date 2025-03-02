export interface IUser {
  id: number | null;
  user: {
    id: number | null;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    personalPhoto: string | null;
    password: string;
    userType: {
      id: number | null;
      code: string;
      name: string | null;
    };
    governorate?: {
      id: number | null;
      code: string;
      name: string | null;
    };
    city?: {
      id: number | null;
      code: string;
      name: string | null;
    };
    engineer: null;
    engineeringOffice: null | string;
    technicalWorker: null;
    enabled: boolean;
  };
  type: {
    id: number | null;
    code: string;
    name: string;
    nameAr: string;
    nameEn: string;
  };
  yearsOfExperience?: number | null;
  engineerServ?: {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    nameEn: string;
  }[];
  workerServs?: {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    nameEn: string;
  }[];
  bio?: string | null;
  linkedin?: string | null;
  behance?: string | null;
}

// ----------------------Project Interface ----------------------

export interface IProjectData {
  id: number;
  statusCode: number | null;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  tools: string;
  images: ProjectImage[];
}
export interface ProjectImage {
  id: number;
  path: string;
}

export interface IFormData {
  projectData: {
    id?: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    tools: string;
  };
  images: File[];
  cover?: File;
}
// ----------------------Services Interface ----------------------
export interface IServices{
    id: number,
    code: string,
    name: string,
    nameAr: string,
  }

