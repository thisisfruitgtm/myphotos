'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Camera, Plus, Upload, LogOut, FolderPlus, Trash2, Lock, MapPin, Info } from 'lucide-react';
import Image from 'next/image';

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  password: string | null;
  _count: { photos: number };
};

type Photo = {
  id: string;
  title: string;
  description: string | null;
  filename: string;
  password: string | null;
  latitude: number | null;
  longitude: number | null;
  location: string | null;
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

export default function DashboardClient({
  categories: initialCategories,
  photos: initialPhotos,
  username,
  userName,
}: {
  categories: Category[];
  photos: Photo[];
  username: string;
  userName: string;
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [photos, setPhotos] = useState(initialPhotos);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  async function createCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const password = formData.get('password') as string;

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, password }),
    });

    if (res.ok) {
      const category = await res.json();
      setCategories([category, ...categories]);
      setShowCategoryDialog(false);
      toast({ title: 'Category created successfully' });
      if (form) form.reset();
    } else {
      toast({ title: 'Failed to create category', variant: 'destructive' });
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm('Delete this category and all its photos?')) return;

    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCategories(categories.filter((c) => c.id !== id));
      setPhotos(photos.filter((p) => (p.category as any).id !== id));
      toast({ title: 'Category deleted' });
    }
  }

  async function uploadPhoto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const res = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const photo = await res.json();
        setPhotos([photo, ...photos]);
        setShowUploadDialog(false);
        toast({ title: 'Photo uploaded successfully' });
        if (form) form.reset();
      } else {
        toast({ title: 'Failed to upload photo', variant: 'destructive' });
      }
    } finally {
      setUploading(false);
    }
  }

  async function deletePhoto(id: string) {
    if (!confirm('Delete this photo?')) return;

    const res = await fetch(`/api/photos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPhotos(photos.filter((p) => p.id !== id));
      toast({ title: 'Photo deleted' });
      setShowPhotoDialog(false);
    }
  }

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
              <h1 className="text-xl font-bold">{userName}</h1>
              <p className="text-sm text-muted-foreground">@{username}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <Camera className="w-4 h-4 mr-2" />
                View Public Gallery
              </Button>
            </a>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Actions */}
        <div className="flex gap-3 mb-8">
          <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
            <DialogTrigger asChild>
              <Button>
                <FolderPlus className="w-4 h-4 mr-2" />
                New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Category</DialogTitle>
                <DialogDescription>Organize your photos into categories</DialogDescription>
              </DialogHeader>
              <form onSubmit={createCategory} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" />
                </div>
                <div>
                  <Label htmlFor="password">Password (optional)</Label>
                  <Input id="password" name="password" type="password" placeholder="Leave empty for public" />
                </div>
                <Button type="submit" className="w-full">Create</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Photo</DialogTitle>
                <DialogDescription>Add a new photo to your portfolio</DialogDescription>
              </DialogHeader>
              <form onSubmit={uploadPhoto} className="space-y-4">
                <div>
                  <Label htmlFor="file">Photo</Label>
                  <Input id="file" name="file" type="file" accept="image/*" required />
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="upload-description">Description</Label>
                  <Input id="upload-description" name="description" />
                </div>
                <div>
                  <Label htmlFor="categoryId">Category</Label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="photo-password">Password (optional)</Label>
                  <Input id="photo-password" name="password" type="password" placeholder="Leave empty for public" />
                </div>
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
            >
              All Photos ({photos.length})
            </Button>
            {categories.map((cat) => (
              <div key={cat.id} className="relative group">
                <Button
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.password && <Lock className="w-3 h-3 mr-2" />}
                  {cat.name} ({cat._count.photos})
                </Button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full items-center justify-center hidden group-hover:flex"
                >
                  <Trash2 className="w-3 h-3 text-destructive-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>

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
                  src={`/api/uploads/${photo.filename}`}
                  alt={photo.title}
                  fill
                  className="object-cover"
                />
                {photo.password && (
                  <div className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                )}
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
            <p>No photos yet. Upload your first photo to get started!</p>
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
                    src={`/api/uploads/${selectedPhoto.filename}`}
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

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => deletePhoto(selectedPhoto.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Photo
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
