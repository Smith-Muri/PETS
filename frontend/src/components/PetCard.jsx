import { Heart, Edit, Trash2, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import Badge from './ui/badge';
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
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="relative w-full h-56 bg-slate-100 overflow-hidden">
        {pet.image ? (
          <img
            src={getImageUrl(pet.image)}
            alt={pet.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-indigo-50 to-blue-50">🐶</div>
        )}

        {/* Public / Private Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={pet.enabled ? 'success' : 'muted'}>
            {pet.enabled ? 'Pública' : 'Privada'}
          </Badge>
        </div>

        {/* Owner private indicator */}
        {isMyPet && !pet.enabled && (
          <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
            <Lock size={14} /> Oculta
          </div>
        )}
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">{pet.name}</h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-1">{pet.funFacts}</p>

        {!isMyPet && (
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center bg-red-50 rounded-full px-3 py-1">
              <Heart size={14} className="fill-red-500 text-red-500" />
              <span className="ml-2 text-sm font-semibold text-red-600">{pet.likeCount || 0}</span>
            </div>
            {pet.likedByMe && (
              <Badge variant="danger" className="ml-auto">Ya diste like</Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4">
        {isMyPet ? (
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit?.(pet.id)}>
              <Edit size={14} /> Editar
            </Button>
            <Button variant="destructive" size="sm" className="flex-1" onClick={() => onDelete?.(pet.id)}>
              <Trash2 size={14} /> Eliminar
            </Button>
          </div>
        ) : (
          <Button
            className="w-full gap-2"
            variant={pet.likedByMe ? 'default' : 'outline'}
            onClick={handleLikeClick}
          >
            <Heart size={16} className={pet.likedByMe ? 'fill-white' : ''} />
            {pet.likedByMe ? 'Likeado' : 'Dar Like'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

