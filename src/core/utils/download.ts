/**
 * Guarda un archivo descargado sin exponer rutas del backend.
 *
 * Los endpoints de Finanzas devuelven el binario con autenticación; el
 * navegador no puede abrirlo con un `<a href>` directo porque perdería la
 * cookie/CSRF. La API pide el blob y aquí se materializa la descarga.
 */
export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
