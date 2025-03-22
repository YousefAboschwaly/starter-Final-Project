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


// ----------------------Product Interface ----------------------
export interface IColor {
  id: number;
  code: string;
  name: string;
  hexColor: string;
}

export interface IProductBaseUnit {
  id: number;
  code: string;
  name: string;
}

export interface IProductMaterial {
  id: number;
  code: string;
  name: string;
}

export interface IBusinessType {
  id: number;
  code: string;
  name: string;
}

export interface IData {
  colors: IColor[];
  productBaseUnits: IProductBaseUnit[];
  productMaterial: IProductMaterial[];
  businessTypes: IBusinessType[];
}

export interface IProductFormData {
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  businessType: {
    id: number
  }
  price: number
  length?: number
  width?: number
  height?: number
  baseUnit: {
    id: number
  }
  materials: {
    id: number
  }[]
  stocks: {
    amount: number
    color: {
      id: number
    }
  }[]
  imagePaths: string[] | {id:number,productId: number, imagePath: string|null}[]
}
export interface IProduct {
  id: number
  name: string
  type: string
  price: number
  stockAmount: number
  length: number
  width: number
  height: number
  rate: number
  colors: IColor[]
  imagePath: string|null
  inStock: boolean
}



// Define interfaces for nested objects



interface IStock {
  id: number;
  statusCode: number | null;
  color: IColor;
  amount: number;
}

interface IImagePath {
  id: number;
  productId: number;
  imagePath: string | null;
}

// Define the main product interface
export interface IProductById {
  id: number;
  statusCode: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  length: number;
  width: number;
  height: number;
  businessType: IBusinessType;
  baseUnit: IProductBaseUnit;
  materials: IProductMaterial[];
  stocks: IStock[];
  imagePaths: IImagePath[];
}
export interface IintialValues {
  businessType: string;
  productNameEn: string;
  productNameAr: string;
  price: string;
  baseUnit: string;
  descriptionEn: string;
  descriptionAr: string;
  length: string;
  width: string;
  height: string;
  materials: string[];
  colorRows: {
    color: string;
    stock: string;
  }[];
  imageFiles: string[];
}



// Define the interface for the pagination object
interface IPageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

// Define the interface for the response object
export interface IProductsResponse {
 data:{ content: IProduct[];
  pageable: IPageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;}
}
