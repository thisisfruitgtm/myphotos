'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Camera, MapPin, Info, LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { photos: number };
};

type Photo = {
  id: string;
  title: string;
  description: string | null;
  filename: string;
  latitude: number | null;
  longitude: number | null;
  camera: string | null;
  lens: string | null;
  focalLength: string | null;
  aperture: string | null;
  shutterSpeed: string | null;
  iso: string | null;
  category: {
    name: string;
  };
};

type User = {
  name: string;
  username: string;
};

export default function GalleryClient({
  user,
  categories,
  photos,
}: {
  user: User;
  categories: Category[];
  photos: Photo[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const filteredPhotos = selectedCategory
    ? photos.filter((p) => (p.category as any).id === selectedCategory)
    : photos;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-sm text-muted-foreground">Photographer Portfolio</p>
            </div>
          </div>
          <Link href="/login">
            <Button variant="ghost">
              <LogIn className="w-4 h-4 mr-2" />
              Admin Login
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Collections</h2>
            <div className="flex gap-3 flex-wrap">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(null)}
              >
                All Photos ({photos.length})
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name} ({cat._count.photos})
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <Card
              key={photo.id}
              className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow"
              onClick={() => {
                setSelectedPhoto(photo);
                setShowPhotoDialog(true);
              }}
            >
              <div className="relative aspect-square">
                <Image
                  src={`/uploads/${photo.filename}`}
                  alt={photo.title}
                  fill
                  className="object-cover"
                />
                {(photo.latitude || photo.longitude) && (
                  <div className="absolute top-2 left-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate">{photo.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{photo.category.name}</p>
              </div>
            </Card>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No public photos available yet.</p>
          </div>
        )}
      </div>

      {/* Photo Detail Dialog */}
      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPhoto && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPhoto.title}</DialogTitle>
                <DialogDescription>{selectedPhoto.category.name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative w-full aspect-video">
                  <Image
                    src={`/uploads/${selectedPhoto.filename}`}
                    alt={selectedPhoto.title}
                    fill
                    className="object-contain"
                  />
                </div>
                {selectedPhoto.description && (
                  <p className="text-sm">{selectedPhoto.description}</p>
                )}
                
                {/* EXIF Data */}
                {(selectedPhoto.camera || selectedPhoto.lens || selectedPhoto.focalLength) && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4" />
                      <h4 className="font-semibold">Camera Info</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {selectedPhoto.camera && (
                        <div><span className="text-muted-foreground">Camera:</span> {selectedPhoto.camera}</div>
                      )}
                      {selectedPhoto.lens && (
                        <div><span className="text-muted-foreground">Lens:</span> {selectedPhoto.lens}</div>
                      )}
                      {selectedPhoto.focalLength && (
                        <div><span className="text-muted-foreground">Focal Length:</span> {selectedPhoto.focalLength}</div>
                      )}
                      {selectedPhoto.aperture && (
                        <div><span className="text-muted-foreground">Aperture:</span> {selectedPhoto.aperture}</div>
                      )}
                      {selectedPhoto.shutterSpeed && (
                        <div><span className="text-muted-foreground">Shutter:</span> {selectedPhoto.shutterSpeed}</div>
                      )}
                      {selectedPhoto.iso && (
                        <div><span className="text-muted-foreground">ISO:</span> {selectedPhoto.iso}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Location */}
                {(selectedPhoto.latitude && selectedPhoto.longitude) && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      <h4 className="font-semibold">Location</h4>
                    </div>
                    <p className="text-sm">
                      {selectedPhoto.latitude.toFixed(6)}, {selectedPhoto.longitude.toFixed(6)}
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${selectedPhoto.latitude},${selectedPhoto.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View on Google Maps
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
