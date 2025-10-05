declare module 'exif-parser' {
  interface ExifData {
    tags?: {
      Make?: string;
      Model?: string;
      LensModel?: string;
      FocalLength?: number;
      FNumber?: number;
      ExposureTime?: number;
      ISO?: number;
      DateTimeOriginal?: number;
      GPSLatitude?: number;
      GPSLongitude?: number;
      [key: string]: any;
    };
  }

  interface Parser {
    parse(): ExifData;
  }

  function create(buffer: Buffer): Parser;

  export = { create };
}
