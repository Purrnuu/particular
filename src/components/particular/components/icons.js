import _ from 'lodash';

let images = [];

export function processImages(icons) {
  images = [];
  _.each(icons, icon => {
    const imageObject = new Image();
    imageObject.src = icon;
    images.push(imageObject);
  });
  return images;
}
