"use client"
import { useState } from "react"
import { Calendar, X } from "lucide-react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"

export const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  tools: z.string().min(1, "Tools are required"),
})

export interface IFormData {
  projectData: {
    name: string
    description: string
    startDate: string
    endDate: string
    tools: string
  }
  images: File[]
  cover?: File
}

export type ProjectFormData = z.infer<typeof formSchema>

interface ProjectFormProps {
  onSubmit: (data: IFormData) => Promise<void>
  defaultValues?: Partial<ProjectFormData>
}

export default function ProjectForm({ onSubmit, defaultValues }: ProjectFormProps) {
  const [coverImage, setCoverImage] = useState<File>()
  const [projectImages, setProjectImages] = useState<File[]>([])
  const [coverPreview, setCoverPreview] = useState<string>()
  const [projectPreviews, setProjectPreviews] = useState<string[]>([])
  const { toast } = useToast()

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      tools: "",
      ...defaultValues,
    },
  })

  const maxDate = new Date()

  const handleCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setCoverImage(undefined)
      setCoverPreview(undefined)
    }
  }

  const handleProjectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setProjectImages((prev) => [...prev, ...files])

      files.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setProjectPreviews((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeCoverImage = () => {
    setCoverImage(undefined)
    setCoverPreview(undefined)
    if (document.getElementById("cover") instanceof HTMLInputElement) {
      ;(document.getElementById("cover") as HTMLInputElement).value = ""
    }
  }

  const removeProjectImage = (index: number) => {
    setProjectImages((prev) => {
      const newImages = [...prev]
      newImages.splice(index, 1)
      return newImages
    })
    setProjectPreviews((prev) => {
      const newPreviews = [...prev]
      newPreviews.splice(index, 1)
      return newPreviews
    })
    if (document.getElementById("images") instanceof HTMLInputElement) {
      const input = document.getElementById("images") as HTMLInputElement
      const dt = new DataTransfer()
      const { files } = input
      if (!files) return
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (index !== i) dt.items.add(file)
      }
      input.files = dt.files
    }
  }

  const handleSubmit = async (data: ProjectFormData) => {
    if (!projectImages.length) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add at least one project image",
      })
      return
    }

    if (data.endDate < data.startDate) {
      form.setError("endDate", {
        type: "manual",
        message: "End date cannot be before start date",
      })
      return
    }

    const formData: IFormData = {
      projectData: {
        name: data.name,
        description: data.description,
        startDate: format(data.startDate, "yyyy-MM-dd"),
        endDate: format(data.endDate, "yyyy-MM-dd"),
        tools: data.tools,
      },
      images: projectImages,
    }

    if (coverImage) {
      formData.cover = coverImage
    }

    console.log("Form data:", formData)

    await onSubmit(formData)
  }

  const startDate = form.watch("startDate")
  const endDate = form.watch("endDate")

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input id="name" {...form.register("name")} />
        {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...form.register("description")} />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 calender">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!startDate && "text-muted-foreground"}`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 date-picker-popup" align="start" onClick={(e) => e.stopPropagation()}>
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  form.setValue("startDate", date as Date)
                  form.clearErrors("startDate")
                }}
                disabled={{ after: maxDate }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.startDate && (
            <p className="text-sm text-destructive">{form.formState.errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-2 calender">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!endDate && "text-muted-foreground"}`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 date-picker-popup" align="start" onClick={(e) => e.stopPropagation()}>
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  form.setValue("endDate", date as Date)
                  form.clearErrors("endDate")
                }}
                disabled={{ before: startDate }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.endDate && (
            <p className="text-sm text-destructive">{form.formState.errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tools">Tools Used</Label>
        <Input id="tools" {...form.register("tools")} />
        {form.formState.errors.tools && (
          <p className="text-sm text-destructive">{form.formState.errors.tools.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover">Cover Image</Label>
        <Input id="cover" type="file" accept="image/*" onChange={handleCoverImage} />
        {coverPreview && (
          <div className="relative mt-2 rounded-lg overflow-hidden border aspect-video">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10 rounded-full w-6 h-6 p-0"
              onClick={removeCoverImage}
            >
              <X className="h-4 w-4" />
            </Button>
            <img src={coverPreview || "/placeholder.svg"} alt="Cover preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Project Images</Label>
        <Input id="images" type="file" accept="image/*" multiple onChange={handleProjectImages} />
        {projectImages.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Selected: {projectImages.length} {projectImages.length === 1 ? "file" : "files"}
          </p>
        )}
        {projectPreviews.length > 0 && (
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
            {projectPreviews.map((preview, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden border aspect-square">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10 rounded-full w-6 h-6 p-0"
                  onClick={() => removeProjectImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <img
                  src={preview || "/placeholder.svg"}
                  alt={`Project image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
        {!projectImages.length && form.formState.isSubmitted && (
          <p className="text-sm text-destructive">At least one project image is required</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Create Project
      </Button>
    </form>
  )
}
