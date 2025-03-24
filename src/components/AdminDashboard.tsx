import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PublicTemplate } from '../types';

export default function AdminDashboard() {
  const [templates, setTemplates] = useState<PublicTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublicTemplates();
  }, []);

  const loadPublicTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('public_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading public templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTemplateStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('public_templates')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      await loadPublicTemplates();
    } catch (error) {
      console.error('Error updating template status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Public Templates Management</h2>
      <div className="grid gap-4">
        {templates.map(template => (
          <div key={template.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{template.name}</h3>
                {template.description && (
                  <p className="text-gray-600 mt-1">{template.description}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded text-sm ${
                  template.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {template.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => toggleTemplateStatus(template.id, template.isActive)}
                  className={`px-4 py-2 rounded ${
                    template.isActive
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {template.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}