export function destroy(array, param) {
  let i = array.length;

  while (i--) {
    try {
      array[i].destroy(param);
    } catch (e) {} // eslint-disable-line
    delete array[i]; // eslint-disable-line
  }

  array.splice(0, array.length);
}
