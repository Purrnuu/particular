import { forEach } from 'lodash-es';

let images: HTMLImageElement[] = [];

export function processImages(icons: (string | HTMLImageElement)[]): HTMLImageElement[] {
  images = [];
  forEach(icons, (icon) => {
    if (typeof icon === 'string') {
      const imageObject = new Image();
      imageObject.src = icon;
      images.push(imageObject);
    } else {
      images.push(icon);
    }
  });
  return images;
}
