import Dialog from './ui/dialog';
import { getImageUrl } from '../config/env';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';

export default function PetModal({ pet, open, onClose }) {
  if (!pet) return null;

  return (
    <Dialog open={open} onClose={onClose} className="max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full h-64 bg-slate-100 rounded-lg overflow-hidden">
          {pet.image ? (
            <img src={getImageUrl(pet.image)} alt={pet.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🐶</div>
          )}
        </div>

        <div className="flex flex-col">
          <h3 className="text-2xl font-bold mb-2">{pet.name}</h3>
          <p className="text-slate-600 mb-4">{pet.funFacts}</p>

          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center bg-red-50 rounded-full px-3 py-1">
              <Heart size={14} className="fill-red-500 text-red-500" />
              <span className="ml-2 text-sm font-semibold text-red-600">{pet.likeCount || 0}</span>
            </div>
            <div className="ml-auto">
              <Button variant="outline">Ver detalles</Button>
            </div>
          </div>

          <div className="mt-auto">
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
