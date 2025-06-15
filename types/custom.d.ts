export type Meal = {
  id?: string;
  name: string;
  tags?: string[] | undefined;
  lastMade?: Date;
  notes?: string[] | undefined;
  img_file?: string;
  img_public_id?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  recipe_link?: string;
};
