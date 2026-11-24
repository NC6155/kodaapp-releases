
/**
 * Catálogos compartidos de KodApp.
 * Utilizados en formularios, filtros y Match.
 */

export const COMUNAS_POR_PROVINCIA: Record<string, string[]> = {
  "Concepción": [
    "Chiguayante",
    "Concepción",
    "Coronel",
    "Florida",
    "Hualpén",
    "Hualqui",
    "Lota",
    "Penco",
    "San Pedro de la Paz",
    "Santa Juana",
    "Talcahuano",
    "Tomé"
  ],

  "Arauco": [
    "Arauco",
    "Cañete",
    "Contulmo",
    "Curanilahue",
    "Lebu",
    "Los Álamos",
    "Tirúa"
  ],

  "Biobío": [
    "Alto Biobío",
    "Antuco",
    "Cabrero",
    "Laja",
    "Los Ángeles",
    "Mulchén",
    "Nacimiento",
    "Negrete",
    "Quilaco",
    "Quilleco",
    "San Rosendo",
    "Santa Bárbara",
    "Tucapel",
    "Yumbel"
  ]
};

export const COMUNAS_BIOBIO: string[] =
  Object.values(COMUNAS_POR_PROVINCIA).flat();

export const RAZAS_POR_TIPO: Record<string, string[]> = {
  perro: [
    "Desconocida",
    "Mestizo",
    "Beagle",
    "Border Collie",
    "Boxer",
    "Bulldog francés",
    "Chihuahua",
    "Cocker Spaniel",
    "Dálmata",
    "Doberman",
    "Golden Retriever",
    "Husky Siberiano",
    "Labrador Retriever",
    "Pastor alemán",
    "Poodle",
    "Pug",
    "Rottweiler",
    "Schnauzer",
    "Shih Tzu",
    "Yorkshire Terrier",
    "Otra"
  ],

  gato: [
    "Desconocida",
    "Mestizo",
    "Americano de pelo corto",
    "Angora",
    "Azul ruso",
    "Bengalí",
    "Británico de pelo corto",
    "Maine Coon",
    "Persa",
    "Ragdoll",
    "Siamés",
    "Siberiano",
    "Sphynx",
    "Otra"
  ],

  otro: [
    "Desconocida",
    "Otra"
  ]
};
