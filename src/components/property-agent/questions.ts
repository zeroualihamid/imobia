
export interface Question {
  id: string;
  text: string;
  field: string;
  options?: string[];
  type: 'select' | 'text' | 'number';
  followUp?: string;
}

export const questions: Question[] = [
  {
    id: 'category',
    text: 'Bonjour ! Je vais vous aider à créer votre bien immobilier. Commençons par la catégorie de bien. Dites-moi : Vente, Location ou Location de vacances ?',
    field: 'category',
    options: ['Vente', 'Location', 'Location de vacances'],
    type: 'select'
  },
  {
    id: 'propertyType',
    text: 'Parfait ! Maintenant, quel est le type de bien ? Vous pouvez choisir parmi : Appartement, Villa et maison de luxe, Locaux commerciaux, Terrain, Maison, Riad, Bureau, ou Ferme.',
    field: 'propertyType',
    options: ['Appartement', 'Villa et maison de luxe', 'Locaux commerciaux', 'Terrain', 'Maison', 'Riad', 'Bureau', 'Ferme'],
    type: 'select'
  },
  {
    id: 'address',
    text: 'Très bien ! Maintenant, pouvez-vous me donner l\'adresse complète du bien ?',
    field: 'address',
    type: 'text'
  },
  {
    id: 'region',
    text: 'Merci ! Dans quelle région se trouve ce bien ?',
    field: 'region',
    type: 'text'
  },
  {
    id: 'city',
    text: 'Parfait ! Et dans quelle ville exactement ?',
    field: 'city',
    type: 'text'
  },
  {
    id: 'district',
    text: 'Très bien ! Quel est l\'arrondissement ?',
    field: 'district',
    type: 'text'
  },
  {
    id: 'neighborhood',
    text: 'Excellent ! Et le quartier ?',
    field: 'neighborhood',
    type: 'text'
  },
  {
    id: 'builtArea',
    text: 'Maintenant parlons des surfaces. Quelle est la surface construite en mètres carrés ?',
    field: 'builtArea',
    type: 'number'
  },
  {
    id: 'livingArea',
    text: 'Merci ! Et la surface habitable en mètres carrés ?',
    field: 'livingArea',
    type: 'number'
  },
  {
    id: 'outdoorArea',
    text: 'Parfait ! Y a-t-il une surface extérieure ? Si oui, combien de mètres carrés ?',
    field: 'outdoorArea',
    type: 'number'
  },
  {
    id: 'bedrooms',
    text: 'Excellent ! Combien de chambres compte ce bien ?',
    field: 'bedrooms',
    type: 'number'
  },
  {
    id: 'rooms',
    text: 'Très bien ! Et combien de pièces au total ?',
    field: 'rooms',
    type: 'number'
  },
  {
    id: 'bathrooms',
    text: 'Parfait ! Combien de salles de bain ?',
    field: 'bathrooms',
    type: 'number'
  },
  {
    id: 'price',
    text: 'Excellent ! Pour finir, quel est le prix demandé en dirhams ?',
    field: 'price',
    type: 'number'
  }
];
