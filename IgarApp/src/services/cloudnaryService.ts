// src/services/cloudinaryService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Serviço Cloudinary — upload de imagens sem backend
// Retorna a URL segura (https) para salvar no Firestore
// ─────────────────────────────────────────────────────────────────────────────

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/du0vcb7vm/image/upload";

// Presets configurados no painel Cloudinary (upload preset = unsigned)
const PRESETS = {
  perfil: "perfil_preset",
  acao: "acao_preset",
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type TipoUpload = "perfil" | "acao";

export interface UploadResult {
  secure_url: string;
  public_id: string;
}

// ─── Upload único ─────────────────────────────────────────────────────────────

/**
 * Envia UMA imagem pro Cloudinary e retorna { secure_url, public_id }.
 *
 * @param imageUri  URI local da imagem (vinda do expo-image-picker)
 * @param tipo      "perfil" ou "acao"
 */
export async function uploadImagem(
  imageUri: string,
  tipo: TipoUpload
): Promise<UploadResult> {
  const data = new FormData();

  const nomeArquivo =
    tipo === "perfil"
      ? `perfil_${Date.now()}.jpeg`
      : `acao_${Date.now()}.jpeg`;

  data.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: nomeArquivo,
  } as any);

  data.append("upload_preset", PRESETS[tipo]);

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: data,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Cloudinary erro ${response.status}: ${err}`);
  }

  const result = await response.json();

  return {
    secure_url: result.secure_url as string,
    public_id: result.public_id as string,
  };
}

// ─── Upload múltiplo ──────────────────────────────────────────────────────────

/**
 * Envia VÁRIAS imagens sequencialmente e retorna array de URLs.
 * Ideal para criar/editar ação com múltiplas fotos.
 *
 * @param imageUris  Array de URIs locais
 * @param tipo       "perfil" ou "acao"
 */
export async function uploadMultiplasImagens(
  imageUris: string[],
  tipo: TipoUpload
): Promise<string[]> {
  const urls: string[] = [];

  for (const uri of imageUris) {
    const result = await uploadImagem(uri, tipo);
    urls.push(result.secure_url);
  }

  return urls;
}