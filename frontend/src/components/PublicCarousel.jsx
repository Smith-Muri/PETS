import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { petsAPI } from '../services/api';
import { getImageUrl } from '../config/env';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';
import PetModal from './PetModal';

export default function PublicCarousel({ onLike }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const trackRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await petsAPI.listPublic(1, 8, '');
        setItems(res.data.data || []);
      } catch (err) {
        console.error('Error loading carousel pets', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const scroll = (dir = 'next') => {
    const el = trackRef.current;
    if (!el) return;
    const w = el.clientWidth;
    // scroll by the visible track width (page-wise)
    el.scrollBy({ left: dir === 'next' ? w : -w, behavior: 'smooth' });

    // Compute page index based on visible cards per page
    const cardWidth = 288; // w-72 ~ 18rem = 288px (approx)
    const visible = Math.max(1, Math.floor(el.clientWidth / cardWidth));
    const pages = Math.max(1, Math.ceil(items.length / visible));
    setPageIndex((prev) => {
      if (dir === 'next') return (prev + 1) % pages;
      return (prev - 1 + pages) % pages;
    });
  };

  // Autoplay: advance every 4s unless paused
  useEffect(() => {
    if (!items.length) return;
    const id = setInterval(() => {
      if (!isPaused) {
        setSlideIndex((s) => (s + 1) % items.length);
        scroll('next');
      }
    }, 4000);
    return () => clearInterval(id);
  }, [items, isPaused]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-6">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-8 px-6 bg-white rounded-xl shadow-md border border-slate-100 text-center">
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative max-w-7xl mx-auto px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-slate-900">Mascotas destacadas</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => scroll('prev')}>◀</Button>
          <Button variant="outline" size="sm" onClick={() => scroll('next')}>▶</Button>
        </div>
      </div>

      {/* Hero image carousel */}
      <div className="w-full rounded-lg overflow-hidden mb-4 relative">
        {items.map((pet, i) => (
          <div
            key={pet.id}
            className={`absolute inset-0 w-full h-64 transition-opacity duration-500 ${i === slideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            {pet.image ? (
              <img
                src={getImageUrl(pet.image)}
                alt={pet.name}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center text-6xl bg-gradient-to-br from-indigo-50 to-blue-50">🐶</div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            <div className="absolute left-6 bottom-6 text-white z-20 max-w-[60%]">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{pet.name}</h3>
              <p className="mt-1 text-sm md:text-base text-white/90 line-clamp-2">{pet.funFacts}</p>
              <div className="mt-3 flex items-center gap-3">
                <Button
                  variant={pet.likedByMe ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onLike?.(pet.id, pet.likedByMe)}
                >
                  <Heart size={14} className={pet.likedByMe ? 'fill-white' : ''} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelected(pet)}>Ver</Button>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute inset-y-0 left-3 flex items-center z-30">
          <Button variant="ghost" size="sm" onClick={() => { setSlideIndex((s) => (s - 1 + items.length) % items.length); scroll('prev'); }}>◀</Button>
        </div>
        <div className="absolute inset-y-0 right-3 flex items-center z-30">
          <Button variant="ghost" size="sm" onClick={() => { setSlideIndex((s) => (s + 1) % items.length); scroll('next'); }}>▶</Button>
        </div>

        {/* Hero indicators */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-3 z-30 flex items-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlideIndex(idx)}
              className={`w-2 h-2 rounded-full ${idx === slideIndex ? 'bg-white' : 'bg-white/40'}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div
        ref={trackRef}
        className="overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory flex gap-4 py-2 px-2"
        style={{ scrollSnapType: 'x mandatory' }}
        role="list"
        aria-label="Mascotas destacadas"
      >
        {items.map((pet) => (
                <article
            key={pet.id}
            className="snap-start flex-none w-72 bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100 transition-transform hover:scale-105"
            role="listitem"
          >
            <div className="w-full h-44 bg-slate-100">
              {pet.image ? (
                <img
                  src={getImageUrl(pet.image)}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-indigo-50 to-blue-50">🐶</div>
              )}
            </div>
              <div className="p-4">
              <h3 className="text-lg font-bold text-slate-900 truncate">{pet.name}</h3>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="inline-flex items-center bg-red-50 rounded-full px-3 py-1">
                          <Heart size={14} className="fill-red-500 text-red-500" />
                          <span className="ml-2 text-sm font-semibold text-red-600">{pet.likeCount || 0}</span>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                          <Button
                            variant={pet.likedByMe ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              if (!isAuthenticated) {
                                // create anon id if missing
                                let anon = localStorage.getItem('anon_id');
                                if (!anon) {
                                  anon = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `anon-${Date.now()}-${Math.floor(Math.random()*10000)}`;
                                  localStorage.setItem('anon_id', anon);
                                }
                              }
                              onLike?.(pet.id, pet.likedByMe);
                            }}
                          >
                            <Heart size={14} className={pet.likedByMe ? 'fill-white' : ''} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setSelected(pet)}>Ver</Button>
                        </div>
                      </div>
            </div>
          </article>
        ))}
      </div>
      {/* Page indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {(() => {
          const cardWidth = 288;
          const el = trackRef.current;
          const visible = el ? Math.max(1, Math.floor(el.clientWidth / cardWidth)) : 1;
          const pages = Math.max(1, Math.ceil(items.length / visible));
          return new Array(pages).fill(0).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = trackRef.current;
                if (!el) return;
                const left = i * el.clientWidth;
                el.scrollTo({ left, behavior: 'smooth' });
                setPageIndex(i);
              }}
              className={`w-2 h-2 rounded-full ${i === pageIndex ? 'bg-indigo-600' : 'bg-indigo-200'}`}
              aria-label={`Página ${i + 1}`}
            />
          ));
        })()}
      </div>

      <PetModal pet={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
