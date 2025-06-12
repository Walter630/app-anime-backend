export function validarNomeAnime(titulo: string): boolean {
    return titulo.trim().length > 0 && /^[\w\s\-\:\!\?]+$/.test(titulo)
}