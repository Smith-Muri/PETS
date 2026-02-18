import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PetCard from '../components/PetCard';
import Pagination from '../components/Pagination';
import { Input } from '../components/ui/input';
import { petsAPI, likesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { Search } from 'lucide-react';

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
  });
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  // Cargar mascotas públicas
  useEffect(() => {
    const loadPets = async () => {
      try {
        setError(null);
        setLoading(true);
        console.log('🐾 Fetching pets from:', debouncedSearch ? `search: ${debouncedSearch}` : 'all');
        const response = await petsAPI.listPublic(
          currentPage,
          12,
          debouncedSearch
        );
        console.log('✅ Pets loaded successfully:', response.data);
        setPets(response.data.data);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('❌ Error loading pets:', error);
        setError(`No se pudo cargar las mascotas: ${error.message}`);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, [currentPage, debouncedSearch]);

  // Handle like
  const handleLike = async (petId, isLiked) => {
    try {
      if (isLiked) {
        await likesAPI.unlike(petId);
      } else {
        await likesAPI.like(petId);
      }
      // Recargar mascotas
      const response = await petsAPI.listPublic(currentPage, 12, debouncedSearch);
      setPets(response.data.data);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6 w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full">
              <span className="text-2xl">🐶</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800 mb-4">
              Descubre Mascotas Adorables
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Explora nuestro catálogo de mascotas fascinantes y da likes a tus favoritas
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12 flex justify-center">
            <div className="w-full max-w-md relative">
              <Search className="absolute left-4 top-4 text-slate-400" size={20} />
              <Input
                placeholder="Busca mascota por nombre..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                type="text"
                className="pl-12 bg-white shadow-lg hover:shadow-xl"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium">Cargando mascotas...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="mb-8 p-6 bg-red-50 border-2 border-red-300 text-red-700 rounded-lg text-center">
              <p className="font-semibold mb-2">⚠️ Error</p>
              <p className="text-sm">{error}</p>
              <p className="text-xs mt-4 text-red-600">
                Asegúrate de que el servidor backend está corriendo en http://localhost:3001
              </p>
            </div>
          )}

          {/* Pets Grid */}
          {!loading && pets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onLike={handleLike}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && pets.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex flex-col items-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-slate-600 text-lg font-medium">
                  {search ? 'No se encontraron mascotas' : 'No hay mascotas disponibles'}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {!loading && pets.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </section>
      </main>
    </>
  );
}

