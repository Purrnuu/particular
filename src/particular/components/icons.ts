let images: HTMLImageElement[] = [];

export function processImages(icons: (string | HTMLImageElement)[]): HTMLImageElement[] {
  images = [];
  for (const icon of icons) {
    if (typeof icon === 'string') {
      const imageObject = new Image();
      imageObject.src = icon;
      images.push(imageObject);
    } else {
      images.push(icon);
    }
  }
  return images;
}
