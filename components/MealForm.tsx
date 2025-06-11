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
import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type MealFormProps = {
  meal: Meal;
  onSubmit: (data: MealFormData) => void;
};

// Type for meal data from database that might have null values
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

  const onValidSubmit = (data: MealFormData) => {
    console.log(`Meal Selected:  ${JSON.stringify(data)}`);
    onSubmit(data);
  };

  console.log("👀 MealFormComponent mounted with meal:", meal);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onValidSubmit, (errors) => {
          console.log("Form validation errors", errors);
        })}
        className="space-y-8"
      >
        {/** Name **/}
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

        {/** Tags **/}
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
                    const value = e.target.value;
                    const tagsArray = value
                      ? value.split(",").map((tag) => tag.trim())
                      : [];
                    field.onChange(tagsArray);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** Last Made **/}
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
                      variant={"outline"}
                      className={"w-[240px] pl-3 text-left font-normal"}
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

        {/** Notes **/}
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
                    const value = e.target.value;
                    const notesArray = value
                      ? value.split("\n").filter((note) => note.trim())
                      : [];
                    field.onChange(notesArray);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** Image Preview **/}
        <div className="relative inline-block w-full max-w-sm rounded overflow-hidden border">
          {form.watch("img_file") && (
            <div className="img-preview">
              <img
                src={form.watch("img_file")}
                alt="Meal preview"
                className="mt-2 rounded-md w-full h-auto max-h-60 object-cover"
              />
              <Button
                variant="ghost"
                type="button"
                size="icon"
                className="top-2 right-2 z-10"
                onClick={() => {
                  form.setValue("img_file", "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Reset file name
                  }
                }}
              >
                <p
                  className="text-red-500 hover:text-red-700 absolute top-2 right-2 bg-black
                  bg-opacity-60rounded-full p-1 hover:bg-opacity-80"
                  aria-label="Remove image"
                >
                  x
                </p>
              </Button>
            </div>
          )}
        </div>

        {/** Image File **/}
        <FormField
          control={form.control}
          name="img_file"
          render={({}) => (
            <FormItem>
              <FormLabel>Image File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        form.setValue("img_file", reader.result as string, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      };
                      reader.readAsDataURL(file);
                    } else {
                      form.setValue("img_file", "", {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                  }}
                  className="h-14 block w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4 file:py-3
                             file:rounded file:border-0
                             file:text-sm file:font-semibold
                             file:bg-blue-50 file:text-blue-700
                             hover:file:bg-blue-100"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** Recipe Link **/}
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
