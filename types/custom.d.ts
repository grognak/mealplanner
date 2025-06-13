export type Meal = {
  id?: string;
  name: string;
  tags?: string[] | undefined;
  lastMade?: Date;
  notes?: string[] | undefined;
  img_file?: string;
  img_public_id?: string;
  recipe_link?: string;
};
