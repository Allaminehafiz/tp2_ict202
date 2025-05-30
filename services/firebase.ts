// services/firebase.ts
import firestore from '@react-native-firebase/firestore';

// 🔢 Fonction pour récupérer le prochain ID auto-incrémenté
const getNextId = async () => {
  const counterRef = firestore().collection('counters').doc('users');

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


// ➕ Ajouter un utilisateur avec ID auto
export const addUser = async (user: { name: string; age: number; sexe: 'M' | 'F' }) => {
  const id = await getNextId();
  await firestore().collection('users').add({ id, ...user });
};

// 📥 Obtenir tous les utilisateurs
export const getUsers = async () => {
  const snapshot = await firestore()
    .collection('users')
    .orderBy('id', 'asc')
    .get();
  return snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
};

// ✏️ Mettre à jour un utilisateur (sauf id)
export const updateUser = async (docId: string, data: { name: string; age: number; sexe: 'M' | 'F' }) => {
  await firestore().collection('users').doc(docId).update(data);
};

// ❌ Supprimer un utilisateur
export const deleteUser = async (docId: string) => {
  await firestore().collection('users').doc(docId).delete();
};
