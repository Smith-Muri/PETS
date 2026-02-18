import { Heart, Edit, Trash2, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';
import { getImageUrl } from '../config/env';
import { useNavigate } from 'react-router-dom';

export default function PetCard({ pet, onLike, onEdit, onDelete, isMyPet = false }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    onLike?.(pet.id, pet.likedByMe);
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative w-full h-56 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
        {pet.image ? (
          <img
            src={getImageUrl(pet.image)}
            alt={pet.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-indigo-50 to-blue-50">
            🐶
          </div>
        )}

        {/* Visibility Badge (for owner) */}
        {isMyPet && !pet.enabled && (
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-white text-sm font-semibold">
            <Lock size={14} />
            Oculta
          </div>
        )}

        {/* Like Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          {!isMyPet && (
            <div className="bg-white rounded-full p-3 shadow-lg">
              <Heart
                size={28}
                className={pet.likedByMe ? 'fill-red-500 text-red-500' : 'text-slate-400'}
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Name */}
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">
          {pet.name}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
          {pet.funFacts}
        </p>

        {/* Like Counter */}
        {!isMyPet && (
          <div className="flex items-center gap-2 mb-4 py-2 px-3 bg-red-50 rounded-lg w-fit">
            <Heart size={16} className="fill-red-500 text-red-500" />
            <span className="text-sm font-bold text-red-600">
              {pet.likeCount || 0} {pet.likeCount === 1 ? 'like' : 'likes'}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          {isMyPet ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 h-9"
                onClick={() => onEdit?.(pet.id)}
              >
                <Edit size={16} />
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 gap-2 h-9"
                onClick={() => onDelete?.(pet.id)}
              >
                <Trash2 size={16} />
                Eliminar
              </Button>
            </>
          ) : (
            <Button
              className="w-full gap-2 h-10 font-semibold"
              variant={pet.likedByMe ? 'default' : 'outline'}
              onClick={handleLikeClick}
            >
              <Heart
                size={18}
                className={pet.likedByMe ? 'fill-white' : ''}
              />
              {pet.likedByMe ? '❤️ Likeado' : '🤍 Dar Like'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

