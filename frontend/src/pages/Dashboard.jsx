/**
 * Dashboard Page
 * Panel privado con CRUD de mascotas del usuario - Diseño profesional
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PetCard from '../components/PetCard';
import { Button } from '../components/ui/button';
import { petsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);
      const response = await petsAPI.getMyPets();
      setPets(response.data.data);
    } catch (error) {
      console.error('Error loading pets:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (petId) => {
    navigate(`/pets/${petId}/edit`);
  };


  const handleDelete = async (petId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta mascota?')) return;

    try {
      await petsAPI.delete(petId);
      setPets((prev) => prev.filter((p) => p.id !== petId));
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800 mb-2">
                  Mis Mascotas
                </h1>
                <p className="text-lg text-slate-600">
                  Hola, <span className="font-semibold text-indigo-600">{user?.name}</span>. Aquí está tu colección de mascotas.
                </p>
              </div>
              <Button
                onClick={() => navigate('/pets/create')}
                className="gap-2 h-12 px-6 text-base font-semibold shadow-lg"
              >
                <Plus size={20} />
                Nueva Mascota
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 font-medium">Cargando tus mascotas...</p>
              </div>
            </div>
          )}

          {/* Pets Grid */}
          {!loading && pets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <div key={pet.id} className="relative group">
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold z-10 flex items-center gap-1 backdrop-blur-sm ${
                    pet.enabled
                      ? 'bg-green-100/90 text-green-700 border border-green-200'
                      : 'bg-slate-100/90 text-slate-700 border border-slate-200'
                  }`}>
                    {pet.enabled ? '✅' : '🔒'} {pet.enabled ? 'Visible' : 'Oculta'}
                  </div>

                  <PetCard
                    pet={pet}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isMyPet={true}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && pets.length === 0 && (
            <div className="text-center py-24">
              <div className="mb-6">
                <div className="text-7xl mb-4">🐾</div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  Aún no tienes mascotas
                </h2>
                <p className="text-slate-600 text-lg max-w-md mx-auto mb-8">
                  Comienza a compartir tus adorables mascotas con la comunidad. ¡Crea tu primera mascota ahora!
                </p>
              </div>
              <Button
                onClick={() => navigate('/pets/create')}
                className="gap-2 h-12 px-8 text-base font-semibold shadow-lg"
              >
                <Plus size={20} />
                Crear Primera Mascota
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

