import { supabase } from './supabase'; // Ajuste o caminho se necessário

const Bucket = "Uploads Tasty Cuisine"

export async function uploadImageToSupabase(imageUri, userId) {
  try {
    if (!imageUri || !userId) {
      console.error('Erro: A imagem e o ID do usuário são obrigatórios.');
      return null;
    }

    const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'png';
    
    // Nome do arquivo fixo usando o ID do usuário (ex: avatars/user_3.png)
    const filePath = `avatars/user_${userId}.${fileExt}`;
    const contentType = `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`;

    // Converte a URI para Blob (funciona na Web)
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Envia com upsert: true para sobrescrever se já existir
    const { data, error } = await supabase.storage
      .from(Bucket)
      .upload(filePath, blob, {
        contentType,
        upsert: true, // 👈 Se já existir um arquivo nesse caminho, ele será substituído
      });

    if (error) throw error;

    // Pega a URL pública
    const { data: publicUrlData } = supabase.storage
      .from(Bucket)
      .getPublicUrl(filePath);

    // Dica para a Web: Adicionamos um timestamp no final apenas para evitar
    // que o navegador mostre a imagem antiga do cache local
    const urlComCacheBuster = `${publicUrlData.publicUrl}?t=${Date.now()}`;

    return urlComCacheBuster;
  } catch (error) {
    console.error('Erro no upload:', error.message);
    return null;
  }
}