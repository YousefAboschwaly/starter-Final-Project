"use client";

import { motion } from "framer-motion";
import { Plus, Edit } from "lucide-react";

interface FormHeaderProps {
  isEditMode?: boolean;
}

export default function FormHeader({ isEditMode = false }: FormHeaderProps) {
  return (
    <>
      <div className="flex items-center mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mr-3"
        >
          {isEditMode ? (
            <Edit className="w-7 h-7 text-indigo-600" />
          ) : (
            <Plus className="w-7 h-7 text-indigo-600" />
          )}
        </motion.div>
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900"
        >
          {isEditMode ? "Edit Product" : "Add New Product"}
        </motion.h1>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 mb-8"
      >
        {isEditMode
          ? "Update the product details below to modify this listing"
          : "Fill Out The Details Below To List Your Product On The Application"}
      </motion.p>
    </>
  );
}
