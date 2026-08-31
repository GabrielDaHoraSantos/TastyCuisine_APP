import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

const supabaseUrl = 'https://xphzvvxmwecnsampbnmx.supabase.co';
const supabaseAnonKey = 'sb_publishable_xznx0wX72X85jhndiuGsZg_ZVovmcwI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === 'web' && typeof window === 'undefined' ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Opcional: Gerencia o refresh automático do token quando o app volta para o foco
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});


export async function uploadImageToSupabase(imageUri) {
  try {
    // 1. Extrair a extensão do arquivo (ex: jpg, png)
    const fileExt = imageUri.split('.').pop().toLowerCase();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `pasta_opcional/${fileName}`; // Nome do arquivo no bucket

    // 2. Ler a imagem como Base64 usando o FileSystem do Expo
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 3. Converter o Base64 para ArrayBuffer (formato aceito pelo Supabase no React Native)
    const arrayBuffer = decode(base64);

    // 4. Fazer o upload para o Supabase Storage
    const { data, error } = await supabase.storage
      .from('Uploads Tasty Cuisine') // Substitua pelo nome do seu bucket no Supabase
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // 5. (Opcional) Obter a URL pública da imagem para salvar no banco de dados
    const { data: publicUrlData } = supabase.storage
      .from('Uploads Tasty Cuisine')
      .getPublicUrl(filePath);

    console.log('Upload bem-sucedido! URL:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;

  } catch (error) {
    console.log('Erro ao fazer upload da imagem:', error.message);
    return null;
  }
}
