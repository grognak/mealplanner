"use client";

import { mealFormSchema, MealFormData } from "@/lib/validators/mealSchema";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TagInput from "@/components/TagInput";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type MealFormProps = {
  defaultMeal?: MealFormData;
  onSubmit: (data: MealFormData) => void;
};

export default function MealForm({ defaultMeal, onSubmit }: MealFormProps) {
  const form = useForm<MealFormData>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: defaultMeal ?? {
      name: "",
      tags: [],
      lastMade: undefined,
      notes: [],
      img_file: "",
      recipe_link: "",
      userId: undefined,
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }, // eslint-disable-line
  } = form;

  const notesFieldArray = useFieldArray<MealFormData, "notes">({
    control,
    name: "notes" as const,
  });

  const onValidSubmit = (data: MealFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onValidSubmit)}
        className="space-y-6 max-w-lg"
      >
        {/* Name */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter meal name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Made */}
        <FormField
          control={control}
          name="lastMade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Made</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Input
                      placeholder="Select date"
                      value={
                        field.value ? field.value.toLocaleDateString() : ""
                      }
                      readOnly
                      className="cursor-pointer"
                    />
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => field.onChange(date ?? undefined)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormItem>
          <FormLabel>Notes</FormLabel>
          <div className="space-y-2">
            {notesFieldArray.fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormControl>
                  <Input
                    {...register(`notes.${index}` as const)}
                    placeholder={`Note #${index + 1}`}
                  />
                </FormControl>
                <Button
                  variant="destructive"
                  size="icon"
                  type="button"
                  onClick={() => notesFieldArray.remove(index)}
                  aria-label={`Remove note ${index + 1}`}
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => notesFieldArray.append("")}
              size="sm"
              variant="outline"
            >
              + Add Note
            </Button>
          </div>
        </FormItem>

        {/* Image File - disabled */}
        <FormField
          control={control}
          name="img_file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Coming Soon)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Image URL"
                  {...field}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Recipe Link */}
        <FormField
          control={control}
          name="recipe_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe Link</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full">
          Save Meal
        </Button>
      </form>
    </Form>
  );
}
