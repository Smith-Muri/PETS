import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { petsAPI } from '../services/api';
import { getImageUrl } from '../config/env';
import { Upload, Eye } from 'lucide-react';
import useFormValidation from '../hooks/useFormValidation';

export default function PetForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    funFacts: '',
    image: null,
    enabled: true,
  });

  const { validate } = useFormValidation({
    name: { required: true, message: 'El nombre es requerido' },
    funFacts: { required: true, message: 'La descripción es requerida' },
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (isEdit) {
      loadPet();
    }
  }, [id]);

  const loadPet = async () => {
    try {
      const response = await petsAPI.getById(id);
      const pet = response.data.data;
      setFormData({
        name: pet.name,
        funFacts: pet.funFacts,
        image: null,
        enabled: pet.enabled === 1,
      });
      if (pet.image) {
        setImagePreview(getImageUrl(pet.image));
      }
    } catch (error) {
      console.error('Error loading pet:', error);
      setError('Error cargando mascota');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validación
    const { valid } = validate(formData);
    if (!valid) {
      // Mantener el mismo mensaje de error para compatibilidad UX
      setError('El nombre y la descripción son requeridos');
      return;
    }

    try {
      setLoading(true);

      // Preparar formData para multipart
      const form = new FormData();
      form.append('name', formData.name);
      form.append('funFacts', formData.funFacts);
      form.append('enabled', formData.enabled ? 1 : 0);
      if (formData.image) {
        form.append('image', formData.image);
      }

      if (isEdit) {
        await petsAPI.update(id, form);
      } else {
        await petsAPI.create(form);
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error procesando mascota');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-2xl border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-200 pb-6">
            <CardTitle className="text-center text-3xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
              {isEdit ? '✏️ Editar Mascota' : '➕ Nueva Mascota'}
            </CardTitle>
            <p className="text-center text-sm text-slate-600 mt-2">
              {isEdit
                ? 'Actualiza la información de tu mascota'
                : 'Agrega una mascota adorable a tu colección'}
            </p>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Imagen Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Foto de tu Mascota
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-input"
                  />
                  <label
                    htmlFor="image-input"
                    className="block border-2 border-dashed border-indigo-300 rounded-xl p-6 text-center cursor-pointer hover:bg-indigo-50 transition-colors"
                  >
                    {imagePreview ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                        <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                          <Upload size={18} />
                          Cambiar imagen
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-6">
                        <Upload size={32} className="text-indigo-400 mb-2" />
                        <p className="font-semibold text-slate-700">
                          Sube una foto de tu mascota
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          Formato: JPG, PNG o WebP (máx 5MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nombre de la Mascota
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Luna, Max, Fluffy..."
                  required
                  className="bg-slate-50"
                />
              </div>

              {/* Fun Facts */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Datos Curiosos
                </label>
                <textarea
                  name="funFacts"
                  value={formData.funFacts}
                  onChange={handleChange}
                  placeholder="Cuenta algo especial sobre tu mascota... ¿Cuál es su raza? ¿Cuántos años tiene? ¿Cuál es su truco favorito?"
                  rows="4"
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none bg-slate-50 placeholder-slate-400"
                />
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <input
                  type="checkbox"
                  id="enabled"
                  name="enabled"
                  checked={formData.enabled}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-2 border-indigo-300 text-indigo-600 cursor-pointer"
                />
                <label htmlFor="enabled" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <Eye size={18} className="text-indigo-600" />
                    Mostrar en catálogo público
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    Otros usuarios podrán ver y dar like a tu mascota
                  </p>
                </label>
              </div>
            </form>
          </CardContent>

          <CardFooter className="gap-3 pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex-1 h-11"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 h-11 text-base font-semibold"
            >
              {loading
                ? isEdit
                  ? 'Actualizando...'
                  : 'Creando...'
                : isEdit
                ? 'Actualizar Mascota'
                : 'Crear Mascota'}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}

