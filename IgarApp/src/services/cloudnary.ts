
// Função de upload de image de perfil e acao
// ele manda a foto do cloudnary
// o segundo parâmetro é pra dizer se é pra "acao" ou "perfil"
// e tem retorno de uma url
// para salvar no firebase depois
export async function uploadImagePerfil(imageUri: string, tipo: string) {
    try {
        const data = new FormData()

        data.append("file", {
            uri: imageUri,
            type: "image/jpeg",

            name: tipo=="perfil" ? "perfilImage.jpeg" : "acaoImage.jpeg"
        } as any);

        if (tipo == "perfil") {
            data.append("upload_preset", "perfil_preset");

        } else if (tipo == "acao") {
            data.append("upload_preset", "acao_preset");
        }

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/du0vcb7vm/image/upload", {
                method: "POST",
                body: data,
            }
        );

        const result = await response.json();

        // pra pergar a URL escreve "result.secure_url" -> link
        // esse link tu vai salvar no firebase
        return result;

    } catch (error) {
        console.log(error);
    }
}