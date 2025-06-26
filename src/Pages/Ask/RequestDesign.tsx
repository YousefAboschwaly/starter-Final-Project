"use client";
import { useEffect, useState, useCallback } from "react";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

type RequestDesignProps = {
  userToken: string | null;
  pathUrl: string;
};

interface IRequestDesign {
  data: {
    unitTypes: UnitType[];
    unitStatuses: UnitStatus[];
    unitWorkTypes: UnitWorkType[];
    workSkills: WorkSkill[];
    governorates: Governorate[];
  };
}

interface UnitType {
  id: number;
  code: string;
  name: string;
  nameAr: string;
  nameEn: string;
}

interface UnitStatus {
  id: number;
  code: string;
  name: string;
  nameAr: string;
  nameEn: string;
}

interface UnitWorkType {
  id: number;
  code: string;
  name: string;
  nameAr: string;
  nameEn: string;
}

interface WorkSkill {
  id: number;
  code: string;
  name: string;
  nameAr: string;
  nameEn: string;
}

interface Governorate {
  id: number;
  code: string;
  name: string;
}

interface FormValues {
  phoneNumber: string;
  unitTypeId: number;
  governorateId: number;
  unitArea: string;
  budget: string;
  requiredDuration: string;
  notes: string;
}

const ErrorMessage = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="text-red-500 text-sm flex items-center mt-1"
  >
    <AlertCircle className="w-4 h-4 mr-1" />
    {message}
  </motion.div>
);

const RequestDesign: React.FC<RequestDesignProps> = ({
  pathUrl,
  userToken,
}) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [designData, setDesignData] = useState<IRequestDesign | null>(null);
  const [activeTab, setActiveTab] = useState(1);

  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, "Invalid phone number")
      .required("Phone number is required"),
    unitTypeId: Yup.number()
      .min(1, "Unit type is required")
      .required("Unit type is required"),
    governorateId: Yup.number()
      .min(1, "Governorate is required")
      .required("Governorate is required"),
    unitArea: Yup.number()
      .typeError("unitArea must be a number")
      .positive("unitArea must be positive")
      .required("unitArea is required"),
    budget: Yup.number()
      .typeError("Budget must be a number")
      .positive("Budget must be positive")
      .required("Budget is required"),
    requiredDuration: Yup.number()
      .typeError("requiredDuration must be a number")
      .positive("requiredDuration must be positive")
      .required("requiredDuration is required"),
    notes: Yup.string().optional(),
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<IRequestDesign>(
        `${pathUrl}/api/v1/home-renovate/lkps`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Accept-Language": "en",

          },
        }
      );
      setDesignData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setAlert({
          message:
            error.response.data.message ||
            "An error occurred during data fetching.",
          type: "error",
        });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [pathUrl, userToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    setIsLoading(true);
    try {
      const payload = {
        phoneNumber: values.phoneNumber,
        isInsideCompound: true,
        unitType: { id: values.unitTypeId },
        governorate: { id: values.governorateId },
        unitArea: Number(values.unitArea),
        budget: Number(values.budget),
        requiredDuration: Number(values.requiredDuration),
        notes: values.notes,
      };

      await axios.post(
        `${pathUrl}/api/v1/request-design`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
            "Accept-Language": "en",
          },
        }
      );

      setAlert({ message: "Design requested successfully!", type: "success" });
      setTimeout(() => {
        setAlert(null);
        navigate('/')

      }, 3000);

      resetForm();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setAlert({
          message:
            error.response.data.message ||
            "An error occurred during submission.",
          type: "error",
        });
        setTimeout(() => {
          setAlert(null);
          navigate('/')

        }, 3000);
      } else {
        setAlert({
          message: "An unexpected error occurred. Please try again.",
          type: "error",
        });
        setTimeout(() => {
          setAlert(null);
          navigate('/')

        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const AlertComponent = ({
    message,
    type,
  }: {
    message: string;
    type: "success" | "error";
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`p-4 rounded-md shadow-md ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white mb-4`}
      >
        {message}
      </motion.div>
    );
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const handleSubmitForm = (formik: FormikProps<FormValues>) => {
    const firstStepFields = [
      "unitTypeId",
      "phoneNumber",
      "budget",
      "governorateId",
      "unitArea",
      "requiredDuration",
    ];

    firstStepFields.forEach((field) => {
      formik.setFieldTouched(field, true, false);
    });

    formik.validateForm().then((errors: Record<string, string>) => {
      const hasErrors: boolean = firstStepFields.some((field: string) =>
        Object.keys(errors).includes(field)
      );

      if (!hasErrors) {
        formik.handleSubmit();
      }
    });
  };

  return (
    <>
      {alert && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 text-white z-50">
          <AlertComponent message={alert.message} type={alert.type} />
        </div>
      )}

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setActiveTab(1)}
          className={`w-1/2 mx-2 px-4 py-2 rounded-lg font-bold ${
            activeTab === 1 ? "border-b-2 border-[#0D132C]" : "bg-none"
          } transition-all duration-200`}
        >
          Design
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`w-1/2 mx-2 px-4 py-2 rounded-lg font-bold ${
            activeTab === 2 ? "border-b-2 border-[#0D132C]" : "bg-none"
          } transition-all duration-200`}
        >
          AI
        </button>
      </div>
      {activeTab === 1 && (
        <Formik
          initialValues={{
            phoneNumber: "",
            unitTypeId: 0,
            governorateId: 0,
            unitArea: "",
            budget: "",
            requiredDuration: "",
            notes: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form className="space-y-4">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                      ? "border-red-500"
                      : ""
                  }
                />
                <AnimatePresence>
                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <ErrorMessage
                      message={formik.errors.phoneNumber as string}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="unitTypeId">Unit Type</Label>
                <Select
                  name="unitTypeId"
                  onValueChange={(value) =>
                    formik.setFieldValue("unitTypeId", Number(value))
                  }
                  value={
                    formik.values.unitTypeId
                      ? formik.values.unitTypeId.toString()
                      : ""
                  }
                  onOpenChange={() =>
                    formik.setFieldTouched("unitTypeId", true)
                  }
                >
                  <SelectTrigger
                    className={
                      formik.touched.unitTypeId && formik.errors.unitTypeId
                        ? "border-red-500"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Select unit type" />
                  </SelectTrigger>
                  <SelectContent>
                    {designData?.data.unitTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <AnimatePresence>
                  {formik.touched.unitTypeId && formik.errors.unitTypeId && (
                    <ErrorMessage
                      message={formik.errors.unitTypeId as string}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="governorateId">Governorate</Label>
                <Select
                  name="governorateId"
                  onValueChange={(value) => {
                    formik.setFieldValue("governorateId", Number(value));
                  }}
                  value={
                    formik.values.governorateId
                      ? formik.values.governorateId.toString()
                      : ""
                  }
                  onOpenChange={() =>
                    formik.setFieldTouched("governorateId", true)
                  }
                >
                  <SelectTrigger
                    className={
                      formik.touched.governorateId &&
                      formik.errors.governorateId
                        ? "border-red-500"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Select governorate" />
                  </SelectTrigger>
                  <SelectContent>
                    {designData?.data.governorates.map((gov) => (
                      <SelectItem key={gov.id} value={gov.id.toString()}>
                        {gov.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <AnimatePresence>
                  {formik.touched.governorateId &&
                    formik.errors.governorateId && (
                      <ErrorMessage
                        message={formik.errors.governorateId as string}
                      />
                    )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="unitArea">Unit Area</Label>
                <Input
                  id="unitArea"
                  placeholder="Unit Area"
                  name="unitArea"
                  type="number"
                  value={formik.values.unitArea}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.unitArea && formik.errors.unitArea
                      ? "border-red-500"
                      : "border-gray-300"
                  }
                />
                {formik.touched.unitArea && formik.errors.unitArea && (
                  <ErrorMessage message={formik.errors.unitArea as string} />
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  placeholder="Budget"
                  name="budget"
                  type="number"
                  value={formik.values.budget}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.budget && formik.errors.budget
                      ? "border-red-500"
                      : "border-gray-300"
                  }
                />
                {formik.touched.budget && formik.errors.budget && (
                  <ErrorMessage message={formik.errors.budget as string} />
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="requiredDuration">Required Duration</Label>
                <Input
                  id="requiredDuration"
                  placeholder="Required Duration"
                  name="requiredDuration"
                  type="number"
                  value={formik.values.requiredDuration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.requiredDuration &&
                    formik.errors.requiredDuration
                      ? "border-red-500"
                      : "border-gray-300"
                  }
                />
                {formik.touched.requiredDuration &&
                  formik.errors.requiredDuration && (
                    <ErrorMessage
                      message={formik.errors.requiredDuration as string}
                    />
                  )}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Notes"
                  name="notes"
                  type="text"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => handleSubmitForm(formik)}
                  className="btn primary-grad w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </motion.div>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default RequestDesign;