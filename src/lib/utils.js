import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import animationData from '@/assets/lottie-json'


export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#36454F] text-white border border-gray-500",
  "bg-[#5e1118] text-white border border-gray-600",
  "bg-[#2b5a23] text-white border border-gray-700",
  "bg-[#003d6b] text-white border border-gray-400" 
];

export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0];
};

export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData
}
