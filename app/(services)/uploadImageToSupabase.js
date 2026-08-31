import { supabase } from './supabase'; // Ajuste o caminho se necessário

export async function uploadImageToSupabase(imageUri) {
  try {
    // Valida se a URI realmente existe
    if (!imageUri) {
      console.error('Erro no upload: Nenhuma URI de imagem foi fornecida.');
      return null;
    }

    // Extrai extensão ou define fallback para png
    const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'png';
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `pasta_opcional/${fileName}`;
    const contentType = `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`;

    // O fetch + blob funciona perfeitamente na Web e no React Native (iOS/Android)
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Envia para o Supabase Storage
    const { data, error } = await supabase.storage
      .from('Uploads Tasty Cuisine')
      .upload(filePath, blob, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error('Erro retornado pelo Supabase Storage:', error);
      throw error;
    }

    // Pega a URL pública
    const { data: publicUrlData } = supabase.storage
      .from('Uploads Tasty Cuisine')
      .getPublicUrl(filePath);

    console.log('Upload realizado com sucesso! URL:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Detalhes do erro no upload:', error);
    return null;
  }
}