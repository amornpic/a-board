import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const enumToArray = (enumObject: any): string[] => {
  return Object.values(enumObject);
};
