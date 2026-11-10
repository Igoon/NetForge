export const APP_VERSION = '0.3.3'
export const VERSION_SEEN_KEY = 'netforge.seenVersion.v1'

export const LATEST_UPDATE = {
  version: APP_VERSION,
  title: 'Fallback WebGL dan pengamanan data graf',
  items: [
    'Kantor 2D tetap bisa dipakai jika WebGL tidak tersedia.',
    'Error boundary mencegah layar kosong saat scene 3D gagal.',
    'Data graf dari localStorage divalidasi dengan Zod.',
    'Node/edge rusak dan edge tanpa tujuan otomatis dibuang.',
  ],
}
