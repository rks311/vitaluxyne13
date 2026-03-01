import wheyImg from "@/assets/whey.jpg";
import creatineImg from "@/assets/creatine.jpg";
import gainerImg from "@/assets/gainer.jpg";
import preworkoutImg from "@/assets/preworkout.jpg";
import bcaaImg from "@/assets/bcaa.jpg";
import fatburnerImg from "@/assets/fatburner.jpg";

const imageMap: Record<string, string> = {
  whey: wheyImg,
  creatine: creatineImg,
  gainer: gainerImg,
  preworkout: preworkoutImg,
  bcaa: bcaaImg,
  fatburner: fatburnerImg,
};

export function useProductImage(key: string): string {
  return imageMap[key] || wheyImg;
}
