export const AppConfig = {
  mediaSize: 10 * 1024 * 1024,
  mediaFormat: /\.(jpe?g|jpg|tiff?|png|webp|bmp|heic|heif)$/i,
  mediaDimensions: {
    width: 640,
    height: 640,
  },
  mediaQuality: 80,
  nutrition: {
    carbs: 4,
    protein: 4,
    fats: 9,
    calorieInGrams: 0.1296,
  },
  pageParam: {
    page: 0,
    size: 20,
  },
};
