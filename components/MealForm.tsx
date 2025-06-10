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
import { useEffect } from "react";
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

        {/** Image File **/}
        <FormField
          control={form.control}
          name="img_file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image File</FormLabel>
              <FormControl>
                {/** When we implement this change it to a image picker **/}
                <Input
                  placeholder="Image Picker coming soon"
                  {...field}
                  value={field.value || ""}
                  readOnly
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
