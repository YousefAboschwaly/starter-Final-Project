import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "@/Contexts/UserContext";
import Slider from 'react-slick';

interface ClientData {
  id: number;
  name: string;
  nameAr: string;
  nameEn: string;
  price: number;
  details: string;
  detailsAr: string;
  detailsEn: string;
}

interface FixedPackageSliderProps {
  data: ClientData[];
  phone: string;
  unitTypeId: string | number;
  InsideCompound: string | undefined;
}

// Custom Arrows
const NextArrow = (props: React.ComponentPropsWithoutRef<'div'> & { onClick?: () => void }) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute right-5 top-1/2 text-2xl cursor-pointer z-10 text-gray-400 font-normal"
    >
      ❯
    </div>
  );
};

const PrevArrow = (props: React.ComponentPropsWithoutRef<'div'> & { onClick?: () => void }) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute left-5 top-1/2 text-2xl cursor-pointer z-10 text-gray-400 font-normal"
    >
      ❮
    </div>
  );
};

const FixedPackageSlider: React.FC<FixedPackageSliderProps> = ({
  data,
  phone,
  unitTypeId,
  InsideCompound,
}) => {
  console.log("phonefromsidedd", phone);
  console.log("unitTypefromsidedd", unitTypeId);
  console.log("insideCompoundfromsidedd", InsideCompound);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasBooked, setHasBooked] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { pathUrl, userToken } = userContext;

  // handleBookPackage function
  const handleBookPackage = async () => {
    if (hasBooked) {
      setAlert({
        message: "Already booked. No need to send data again.",
        type: "error",
      });
      setTimeout(() => {
        setAlert(null);
      }, 3000);
      return;
    }

    const item = data[currentIndex];
    if (!item) {
      setAlert({
        message: "No item found for current index",
        type: "error",
      });
      setTimeout(() => {
        setAlert(null);
      }, 3000);
      return;
    }

    const dataToSend = {
      phoneNumber: phone,
      isInsideCompound: InsideCompound,
      unitType: {
        id: unitTypeId,
      },
      customPackage: {
        id: item.id,
      },
    };
    console.log("Sending data:", dataToSend);

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${pathUrl}/api/v1/select-custom-package`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.message) {
        setAlert({
          message: response.data.message,
          type: "success",
        });
      } else {
        setAlert({
          message: "Package booked successfully!",
          type: "success",
        });
      }

      setHasBooked(true);
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setAlert({
          message:
            error.response.data.message ||
            "An error occurred during submission.",
          type: "error",
        });
      } else {
        setAlert({
          message: "An unexpected error occurred. Please try again.",
          type: "error",
        });
      }
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    afterChange: (current: number) => setCurrentIndex(current),
  };

  const Alert = ({
    message,
    type,
  }: {
    message: string;
    type: "success" | "error";
  }) => {
    return (
      <div
        className={`p-4 mb-4 text-white ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        } rounded-md`}
      >
        {message}
      </div>
    );
  };

  return (
    <>
      {alert && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 text-white z-50">
          <Alert message={alert.message} type={alert.type} />
        </div>
      )}
      <div className="relative w-full mx-auto">
        <Slider {...settings}>
          {data.map((item, index) => (
            <div key={index}>
              <div className="max-h-[420px] overflow-y-scroll scrollbar-hide p-4 rounded-md">
                <h3 className="mb-3">
                  <span className="font-bold">Package Name:</span>
                  <span className="text-gray-600">{item?.name}</span>
                </h3>
                <h3 className="mb-4">
                  <span className="font-bold">Price:</span>
                  <span className="text-gray-600"> {item.price} EGP</span>
                </h3>

                <div className="text-gray-700">
                  {item?.detailsEn.split("<h3>").map((block, idx) =>
                    block ? (
                      <div key={idx} className="mb-2">
                        <h3 className="font-bold mb-1 text-gray-800">
                          {block.split("</h3>")[0]}
                        </h3>
                        <div
                          className="pl-4 list-disc text-gray-600"
                          dangerouslySetInnerHTML={{
                            __html: block.split("</h3>")[1],
                          }}
                        />
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="btn primary-grad w-full"
            onClick={handleBookPackage}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              "Book the Package"
            )}
          </Button>
        </div>
      </div>
    </>
  );
};
export default FixedPackageSlider;
