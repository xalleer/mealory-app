export type AllergyId =
  | "nuts"
  | "gluten"
  | "lactose"
  | "eggs"
  | "fish"
  | "soy"
  | "shellfish"
  | "sesame";

export const ALLERGIES: { id: AllergyId; label: string }[] = [
  { id: "nuts", label: "Горіхи" },
  { id: "gluten", label: "Глютен" },
  { id: "lactose", label: "Лактоза" },
  { id: "eggs", label: "Яйця" },
  { id: "fish", label: "Риба" },
  { id: "soy", label: "Соя" },
  { id: "shellfish", label: "Молюски" },
  { id: "sesame", label: "Кунжут" },
];
