export type GoalId =
  | "weight_loss"
  | "weight_gain"
  | "healthy_eating"
  | "maintain_weight";

export const GOALS: { id: GoalId; label: string; icon: string }[] = [
  { id: "weight_loss", label: "Схуднення", icon: "trending-down" },
  { id: "weight_gain", label: "Набір ваги", icon: "trending-up" },
  { id: "healthy_eating", label: "Здорове харчування", icon: "nutrition" },
  { id: "maintain_weight", label: "Підтримка ваги", icon: "refresh" },
];
