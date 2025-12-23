import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Slide } from '../types/carousel';

interface EditSlideModalProps {
  slide: Slide;
  onSave: (slide: Slide) => void;
  onClose: () => void;
}

export default function EditSlideModal({ slide, onSave, onClose }: EditSlideModalProps) {
  const [editedSlide, setEditedSlide] = useState<Slide>({ ...slide });

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...(editedSlide.bullets || [])];
    newBullets[index] = value;
    setEditedSlide({ ...editedSlide, bullets: newBullets });
  };

  const addBullet = () => {
    if ((editedSlide.bullets?.length || 0) >= 5) {
      alert('Maximum 5 bullets per slide');
      return;
    }
    setEditedSlide({
      ...editedSlide,
      bullets: [...(editedSlide.bullets || []), '']
    });
  };

  const removeBullet = (index: number) => {
    const newBullets = (editedSlide.bullets || []).filter((_, i) => i !== index);
    setEditedSlide({ ...editedSlide, bullets: newBullets });
  };

  const handleSave = () => {
    if (!editedSlide.title.trim()) {
      alert('Title cannot be empty');
      return;
    }

    if (editedSlide.bullets?.some(b => b.length > 80)) {
      alert('Each bullet must be 80 characters or less');
      return;
    }

    if (editedSlide.content !== undefined && editedSlide.content.length > 500) {
      alert('Content must be 500 characters or less');
      return;
    }

    onSave({ ...editedSlide, is_edited: true });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Edit Slide {slide.slide_number}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Title
            </label>
            <input
              type="text"
              value={editedSlide.title}
              onChange={(e) => setEditedSlide({ ...editedSlide, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              maxLength={100}
            />
          </div>

          {slide.type === 'cover' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={editedSlide.subtitle || ''}
                onChange={(e) => setEditedSlide({ ...editedSlide, subtitle: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                maxLength={100}
              />
            </div>
          )}

          {(slide.type === 'content' || slide.type === 'cta') && (
            <>
              {editedSlide.content !== undefined ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Content (Paragraph format)
                  </label>
                  <textarea
                    value={editedSlide.content || ''}
                    onChange={(e) => setEditedSlide({ ...editedSlide, content: e.target.value })}
                    placeholder="Write 4-5 lines of fluid prose text..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                    rows={6}
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {editedSlide.content?.length || 0}/500
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Content Bullets
                    </label>
                    <span className="text-xs text-gray-500">
                      {editedSlide.bullets?.length || 0}/5
                    </span>
                  </div>
                  <div className="space-y-3">
                    {(editedSlide.bullets || []).map((bullet, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => handleBulletChange(index, e.target.value)}
                          placeholder={`Bullet point ${index + 1}`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          maxLength={80}
                        />
                        <button
                          onClick={() => removeBullet(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                    {(editedSlide.bullets?.length || 0) < 5 && (
                      <button
                        onClick={addBullet}
                        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        Add Bullet Point
                      </button>
                    )}
                  </div>
                </div>
              )}

              {slide.type === 'content' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Stats / Highlight (optional)
                  </label>
                  <input
                    type="text"
                    value={editedSlide.stats || ''}
                    onChange={(e) => setEditedSlide({ ...editedSlide, stats: e.target.value })}
                    placeholder="e.g., Founded in 2011, 500M+ users"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    maxLength={100}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
