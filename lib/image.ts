import sharp from 'sharp';
import exifParser from 'exif-parser';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export interface ImageMetadata {
  width: number;
  height: number;
  size: number;
  mimeType: string;
  latitude?: number;
  longitude?: number;
  dateTaken?: Date;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
}

export async function processImage(
  buffer: Buffer,
  originalName: string
): Promise<{ filename: string; metadata: ImageMetadata }> {
  const ext = path.extname(originalName).toLowerCase();
  const filename = `${crypto.randomBytes(16).toString('hex')}${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filepath = path.join(uploadDir, filename);

  // Ensure upload directory exists
  await mkdir(uploadDir, { recursive: true });

  // Extract EXIF data before compression
  let exifData: any = {};
  try {
    const parser = exifParser.create(buffer);
    const result = parser.parse();
    exifData = result.tags;
  } catch (error) {
    console.log('No EXIF data found or error parsing:', error);
  }

  // Process image with sharp - compress but keep sharp
  const processed = await sharp(buffer)
    .rotate() // Auto-rotate based on EXIF orientation
    .withMetadata() // Preserve metadata
    .jpeg({ quality: 85, mozjpeg: true }) // High quality compression
    .toBuffer();

  await writeFile(filepath, processed);

  // Get image dimensions
  const metadata = await sharp(processed).metadata();

  // Build metadata object
  const imageMetadata: ImageMetadata = {
    width: metadata.width || 0,
    height: metadata.height || 0,
    size: processed.length,
    mimeType: 'image/jpeg',
  };

  // Add EXIF data if available
  if (exifData.GPSLatitude && exifData.GPSLongitude) {
    imageMetadata.latitude = exifData.GPSLatitude;
    imageMetadata.longitude = exifData.GPSLongitude;
  }

  if (exifData.DateTimeOriginal) {
    imageMetadata.dateTaken = new Date(exifData.DateTimeOriginal * 1000);
  }

  if (exifData.Make && exifData.Model) {
    imageMetadata.camera = `${exifData.Make} ${exifData.Model}`.trim();
  }

  if (exifData.LensModel) {
    imageMetadata.lens = exifData.LensModel;
  }

  if (exifData.FocalLength) {
    imageMetadata.focalLength = `${exifData.FocalLength}mm`;
  }

  if (exifData.FNumber) {
    imageMetadata.aperture = `f/${exifData.FNumber}`;
  }

  if (exifData.ExposureTime) {
    imageMetadata.shutterSpeed = `1/${Math.round(1 / exifData.ExposureTime)}s`;
  }

  if (exifData.ISO) {
    imageMetadata.iso = `ISO ${exifData.ISO}`;
  }

  return { filename, metadata: imageMetadata };
}
