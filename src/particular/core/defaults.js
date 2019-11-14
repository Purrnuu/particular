export const defaultConfiguration = {
  maxCount: 300,
  rate: 8,
  life: 30,
  pixelRatio: 2,
  zIndex: 10000,
  autoStart: false,
  continuous: false,
};

export function configure(configuration) {
  return { ...defaultConfiguration, ...configuration };
}
