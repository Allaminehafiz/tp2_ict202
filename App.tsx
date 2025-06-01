import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';

import { addUser, getUsers, updateUser, deleteUser } from './services/firebase';
import { addDish, getDishes, updateDish, deleteDish } from './services/dishService';

export default function App() {
  const [currentView, setCurrentView] = useState<'users' | 'dishes'>('users');

  // === États utilisateurs ===
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sexe, setSexe] = useState<'M' | 'F' | ''>('');
  const [users, setUsers] = useState<any[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // === États plats ===
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [date, setDate] = useState('');
  const [disponible, setDisponible] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [plats, setPlats] = useState<any[]>([]);

  // === Chargements initiaux ===
  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const fetchDishes = async () => {
    const data = await getDishes();
    setPlats(data);
  };

  useEffect(() => {
    fetchUsers();
    fetchDishes();
  }, []);

  // === Gestion utilisateurs ===
  const handleUserSubmit = async () => {
    if (!name || !age || !sexe) return alert("Veuillez remplir tous les champs.");

    const user = { name, age: Number(age), sexe };

    if (editingUserId) {
      await updateUser(editingUserId, user);
      setEditingUserId(null);
    } else {
      await addUser(user);
    }

    setName('');
    setAge('');
    setSexe('');
    fetchUsers();
  };

  const handleUserEdit = (item: any) => {
    setName(item.name);
    setAge(item.age.toString());
    setSexe(item.sexe);
    setEditingUserId(item.docId);
  };

  const handleUserDelete = async (docId: string) => {
    await deleteUser(docId);
    fetchUsers();
  };

  // === Gestion plats ===
  const handleDishSubmit = async () => {
    if (!nom || !description || !prix || !date) {
      return alert('Veuillez remplir tous les champs');
    }

    const dish = {
      nom,
      description,
      prix: Number(prix),
      date,
      disponible,
    };

    if (editingDishId) {
      await updateDish(editingDishId, dish);
      setEditingDishId(null);
    } else {
      await addDish(dish);
    }

    setNom('');
    setDescription('');
    setPrix('');
    setDate('');
    setDisponible(false);
    fetchDishes();
  };

  const handleDishEdit = (item: any) => {
    setNom(item.nom);
    setDescription(item.description);
    setPrix(item.prix.toString());
    setDate(item.date);
    setDisponible(item.disponible);
    setEditingDishId(item.docId);
  };

  const handleDishDelete = async (docId: string) => {
    await deleteDish(docId);
    fetchDishes();
  };

  // === Rendu vue utilisateurs ===
  const renderUsersView = () => (
    <>
      <Text style={styles.title}>Utilisateurs Firebase</Text>

      <TextInput
        placeholder="Nom"
        placeholderTextColor="#888"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Âge"
        placeholderTextColor="#888"
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Sexe</Text>
      <View style={styles.sexeContainer}>
        <TouchableOpacity
          style={[styles.sexeButton, sexe === 'M' && styles.sexeButtonSelected]}
          onPress={() => setSexe('M')}
        >
          <Text style={styles.sexeText}>M</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sexeButton, sexe === 'F' && styles.sexeButtonSelected]}
          onPress={() => setSexe('F')}
        >
          <Text style={styles.sexeText}>F</Text>
        </TouchableOpacity>
      </View>

      <Button title={editingUserId ? "Modifier" : "Ajouter"} onPress={handleUserSubmit} />

      <FlatList
        data={users}
        keyExtractor={(item) => item.docId}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.userText}>ID: {item.id}</Text>
            <Text style={styles.userText}>Nom: {item.name}</Text>
            <Text style={styles.userText}>Âge: {item.age}</Text>
            <Text style={styles.userText}>Sexe: {item.sexe}</Text>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleUserEdit(item)}>
                <Text style={styles.edit}>✏️ Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleUserDelete(item.docId)}>
                <Text style={styles.delete}>🗑️ Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </>
  );

  // === Rendu vue plats ===
  const renderDishesView = () => (
    <>
      <Text style={styles.title}>Plats du jour</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom du plat"
        placeholderTextColor="#888"
        value={nom}
        onChangeText={setNom}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Prix"
        placeholderTextColor="#888"
        value={prix}
        onChangeText={setPrix}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        placeholderTextColor="#888"
        value={date}
        onChangeText={setDate}
      />

      <View style={styles.switchContainer}>
        <Text>Disponible aujourd’hui</Text>
        <Switch value={disponible} onValueChange={setDisponible} />
      </View>

      <Button title={editingDishId ? 'Modifier' : 'Ajouter'} onPress={handleDishSubmit} />

      <FlatList
        data={plats}
        keyExtractor={(item) => item.docId}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>ID: {item.id}</Text>
            <Text style={styles.text}>Nom: {item.nom}</Text>
            <Text style={styles.text}>Prix: {item.prix} FCFA</Text>
            <Text style={styles.text}>Date: {item.date}</Text>
            <Text style={styles.text}>Disponible: {item.disponible ? 'Oui' : 'Non'}</Text>
            <Text style={styles.text}>Description: {item.description}</Text>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleDishEdit(item)}>
                <Text style={styles.edit}>✏️ Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDishDelete(item.docId)}>
                <Text style={styles.delete}>🗑️ Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </>
  );

  return (
    <View style={styles.container}>
      {/* Switch entre vues */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
        <Button title="Utilisateurs" onPress={() => setCurrentView('users')} />
        <Button title="Plats du jour" onPress={() => setCurrentView('dishes')} />
      </View>

      {currentView === 'users' ? renderUsersView() : renderDishesView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },

  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },

  label: { fontSize: 16, marginBottom: 5, fontWeight: '500' },

  sexeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  sexeButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },

  sexeButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },

  sexeText: {
    color: '#000',
    fontWeight: 'bold',
  },

  item: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },

  userText: { fontSize: 16 },

  text: { fontSize: 16 },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },

  edit: { color: '#007bff' },

  delete: { color: '#ff4444' },

  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
});
