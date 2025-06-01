// services/dishService.ts
import firestore from '@react-native-firebase/firestore';

// 🔢 Fonction pour récupérer le prochain ID auto-incrémenté des plats
const getNextDishId = async () => {
  const counterRef = firestore().collection('counters').doc('dishes');

  return firestore().runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    const current = counterDoc.exists && typeof counterDoc.data()?.value === 'number'
      ? counterDoc.data()?.value
      : 0;

    const next = current + 1;

    transaction.set(counterRef, { value: next });

    return next;
  });
};

// ➕ Ajouter un plat avec ID auto
export const addDish = async (dish: {
  nom: string;
  description: string;
  prix: number;
  date: string;
  disponible: boolean;
}) => {
  const id = await getNextDishId();
  await firestore().collection('dishes').add({ id, ...dish });
};

// 📥 Obtenir tous les plats
export const getDishes = async () => {
  const snapshot = await firestore()
    .collection('dishes')
    .orderBy('id', 'asc')
    .get();
  return snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
};

// ✏️ Mettre à jour un plat (sauf id)
export const updateDish = async (
  docId: string,
  data: {
    nom: string;
    description: string;
    prix: number;
    date: string;
    disponible: boolean;
  }
) => {
  await firestore().collection('dishes').doc(docId).update(data);
};

// ❌ Supprimer un plat
export const deleteDish = async (docId: string) => {
  await firestore().collection('dishes').doc(docId).delete();
};
