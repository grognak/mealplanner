"use client";

import { MealFormData, mealFormSchema } from "@/lib/validators/mealSchema";
import { Meal } from "@/types/custom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import imageCompression from "browser-image-compression";

type MealFormProps = {
  meal: Meal;
  onSubmit: (data: MealFormData) => void;
};

type DatabaseMeal = Meal & {
  img_file?: string | null;
  recipe_link?: string | null;
  tags?: string[] | null;
  notes?: string[] | null;
  lastMade?: Date | string | null;
  userId?: string;
};

export default function MealFormComponent({ meal, onSubmit }: MealFormProps) {
  const partialMealFormSchema = mealFormSchema.partial();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const buildCloudinaryUrl = (publicId: string) =>
    `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,q_auto,f_auto,w_600,h_300/${publicId}`;

  const getFormDefaults = (meal: DatabaseMeal | null | undefined) => {
    if (!meal) {
      return {
        id: "",
        name: "",
        tags: [],
        lastMade: undefined,
        notes: [],
        img_file: "",
        recipe_link: "",
        userId: undefined,
      };
    }

    return {
      id: meal.id || "",
      name: meal.name || "",
      tags: meal.tags || [],
      lastMade: meal.lastMade || undefined,
      notes: meal.notes || [],
      img_file: meal.img_file === null ? "" : meal.img_file || "",
      recipe_link: meal.recipe_link === null ? "" : meal.recipe_link || "",
      userId: meal.userId || undefined,
    };
  };

  const form = useForm<MealFormData>({
    resolver: zodResolver(partialMealFormSchema) as Resolver<MealFormData>,
    defaultValues: getFormDefaults(meal),
  });

  useEffect(() => {
    form.reset(meal);
  }, [meal]);

  const onValidSubmit = async (data: MealFormData) => {
    let imageUrl: string | undefined;
    let publicId: string | undefined;

    try {
      if (selectedFile) {
        setUploading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await fetch("/api/images/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const cloudinaryResult = await res.json();
        imageUrl = cloudinaryResult.secure_url;
        publicId = cloudinaryResult.public_id;
      }

      const mealPayload = {
        ...data,
        img_url: imageUrl,
        img_public_id: publicId,
      };

      onSubmit(mealPayload);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValidSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Name</FormLabel>
              <FormControl>
                <Input placeholder="eg Beef Tacos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="breakfast, vegetarian, quick"
                  value={
                    Array.isArray(field.value) ? field.value.join(", ") : ""
                  }
                  onChange={(e) => {
                    const tagsArray = e.target.value
                      ? e.target.value.split(",").map((tag) => tag.trim())
                      : [];
                    field.onChange(tagsArray);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastMade"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Last Made</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-[240px] pl-3 text-left font-normal"
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The last time you made this meal.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="- Notes about the meal"
                  value={
                    Array.isArray(field.value) ? field.value.join("\n") : ""
                  }
                  onChange={(e) => {
                    const notesArray = e.target.value
                      ? e.target.value.split("\n").filter((note) => note.trim())
                      : [];
                    field.onChange(notesArray);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {uploading && <p className="text-blue-600">Uploading image...</p>}

        <FormField
          control={form.control}
          name="img_file"
          render={() => (
            <FormItem>
              <FormLabel>Image File</FormLabel>
              <div className="relative inline-block w-full max-w-sm rounded overflow-hidden border">
                {(form.watch("img_file") || meal.img_public_id) && (
                  <div className="relative w-full max-w-md rounded overflow-hidden border">
                    <img
                      src={
                        form.watch("img_file") ||
                        buildCloudinaryUrl(meal.img_public_id as string)
                      }
                      alt="Meal preview"
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      variant="ghost"
                      type="button"
                      size="icon"
                      className="top-2 right-2 z-10"
                      aria-label="Remove image"
                      disabled={uploading}
                      onClick={() => {
                        form.setValue("img_file", "", {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setSelectedFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <p
                        className="text-red-500 hover:text-red-700 absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1 hover:bg-opacity-80"
                        aria-label="Remove image"
                      >
                        x
                      </p>
                    </Button>
                  </div>
                )}
              </div>

              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const compressedFile = await imageCompression(file, {
                          maxSizeMB: 1,
                          maxWidthOrHeight: 1024,
                          useWebWorker: true,
                        });

                        setSelectedFile(compressedFile);

                        const reader = new FileReader();
                        reader.onloadend = () => {
                          form.setValue("img_file", reader.result as string, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        };
                        reader.readAsDataURL(compressedFile);
                      } catch (err) {
                        console.error("Image compression failed", err);
                      }
                    } else {
                      form.setValue("img_file", "", {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                  }}
                  className="h-14 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recipe_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="link to the recipe page"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
