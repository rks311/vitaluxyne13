import { removeBackground } from "@imgly/background-removal";

export async function removeBg(imageFile: File): Promise<Blob> {
  const blob = await removeBackground(imageFile, {
    progress: (key, current, total) => {
      // Progress callback - model downloads on first use (~30MB cached)
      console.log(`[BG Removal] ${key}: ${Math.round((current / total) * 100)}%`);
    },
  });
  return blob;
}
