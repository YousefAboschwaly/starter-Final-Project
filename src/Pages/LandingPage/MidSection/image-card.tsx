

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ImageCardProps {
  imageSrc: string
  bgColor?: string
  badgeText?: string
  badgeColor?: string
  fullHeight?: boolean,
  style?: string
}

export default function ImageCard({
  imageSrc,
  bgColor = "bg-white",
  badgeText,
  badgeColor = "bg-yellow-300",
  fullHeight = false,
  style = "",
}: ImageCardProps) {
  return (
    <motion.div
      className={`h-full ${fullHeight ? "flex-1" : ""}`}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Card className="overflow-hidden border-0 shadow-sm h-full">
        <CardContent className={`p-0 h-full flex flex-col ${bgColor}`}>
          <div className="relative h-full flex items-center justify-center">
            {badgeText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-2 right-2 z-10"
              >
                <Badge className={`${badgeColor} border-0 text-black font-normal px-2 py-1 hover:text-yellow-400`}>{badgeText}</Badge>
              </motion.div>
            )}
            <img
              src={imageSrc || "/placeholder.svg?height=150&width=150"}
              alt="Product image"
    
              className={`object-cover ${style ? style : ' w-[205px] ' } h-[205px]`}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
