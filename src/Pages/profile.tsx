import { Sidebar } from "../MyComponents/sidebar"
import { PortfolioGrid } from "../MyComponents/portfolio-grid"
import ProfileCover from '/Rectangle.png'
import { useContext, useEffect, useRef } from "react"
import { UserContext } from "@/Contexts/UserContext";
import AddProject from "@/MyComponents/add-project";

export default function Profile() {

  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { showAddProject,setShowAddProject } = userContext;
  const addProjectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // When AddProject is shown, prevent body scrolling
    if (showAddProject) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showAddProject])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (addProjectRef.current && !addProjectRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement
        if (
          !target.closest(".add-project") &&
          !target.closest(".date-picker-popup") &&
          !target.closest("[role='dialog']")
        ) {
          // Do nothing here, we want to keep the AddProject form open
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showAddProject]) // Removed unnecessary setShowAddProject dependency

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add Project */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 overflow-auto">
          <div className="min-h-screen py-8 px-4">
            <div ref={addProjectRef} className="add-project">
              <AddProject onClose={() => setShowAddProject(false)} />
            </div>
          </div>
        </div>
      )}
      {/* Hero Banner */}
      <div className=" h-[200px] w-full md:h-[300px] bg-slate-600">
        <img
          src={ProfileCover}
          alt="Modern living room with white sofa"
          
          className="object-cover h-full w-full  "
        />
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <Sidebar />
          <main className="flex-1">
            <PortfolioGrid />
          </main>
        </div>
      </div>
    </div>
  )
}

