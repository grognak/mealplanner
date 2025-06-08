export type Meal = {
  id: string;
  name: string;
  tags: string[];
  lastMade?: Date;
  notes: string[];
  img_file?: string;
  recipe_link?: string;
};
