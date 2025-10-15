import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ItemCategory } from "@/data/items";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Gera um código único baseado na categoria
export function generateUniqueCode(category: ItemCategory, existingCodes: string[]): string {
  const prefix = getCategoryPrefix(category);
  let counter = 1;
  let code = `${prefix}${String(counter).padStart(3, '0')}`;
  
  // Encontra o próximo número disponível
  while (existingCodes.includes(code)) {
    counter++;
    code = `${prefix}${String(counter).padStart(3, '0')}`;
  }
  
  return code;
}

function getCategoryPrefix(category: ItemCategory): string {
  switch (category) {
    case "Peça/Ferramenta":
      return "PF";
    case "EPI":
      return "EPI";
    case "Consumível":
      return "CNS";
    default:
      return "ITM";
  }
}

