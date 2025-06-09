import SectionHeader from "./section-header"
import ImageCard from "./image-card"

export default function MidSect() {
  return (
    <main className="max-w-[87rem] mx-auto px-4  py-8 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* More reasons to shop section */}
        <div className="md:col-span-1 flex flex-col h-full  bg-white p-4 ">

          <SectionHeader text="More reasons to shop" />
          <div className="grid grid-cols-2 gap-4 flex-grow">
            <ImageCard imageSrc="/ProductImages/prod4.png" bgColor="bg-green-100" />
            <ImageCard imageSrc="/ProductImages/prod5.png" bgColor="bg-yellow-100" />
            <ImageCard imageSrc="/ProductImages/prod6.png" bgColor="bg-red-50" />
            <ImageCard imageSrc="/ProductImages/prod7.png" bgColor="bg-yellow-100" />
          </div>
        </div>

        {/* Mega deals section */}
        <div className="md:col-span-1 bg-[#FDF6BB] p-4  flex flex-col h-full">
          <SectionHeader text="Mega deals" />
          <div className="grid grid-cols-2 gap-4 flex-grow">
            <ImageCard imageSrc="/ProductImages/prod8.png" badgeText="Fashion deals" badgeColor="bg-yellow-300" />
            <ImageCard imageSrc="/ProductImages/prod9.png" badgeText="Gaming deals" badgeColor="bg-yellow-300" />
            <ImageCard imageSrc="/ProductImages/prod10.png" badgeText="Baby deals" badgeColor="bg-yellow-300" />
            <ImageCard imageSrc="/ProductImages/prod11.png" badgeText="Stationery deals" badgeColor="bg-yellow-300" />
          </div>
        </div>

        {/* In focus section */}
        <div className="md:col-span-1 flex flex-col h-full  bg-white p-4">
          <SectionHeader text="In focus" />
          <div className="flex flex-col gap-4 flex-grow">
            <ImageCard imageSrc="/ProductImages/prod2.jpg" bgColor="bg-blue-50" fullHeight style="w-full "/>
            <ImageCard imageSrc="/ProductImages/prod3.jpg" bgColor="bg-red-50" fullHeight style="w-full " />
          </div>
        </div>
      </div>
    </main>
  )
}
