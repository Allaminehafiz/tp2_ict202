import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { addUser, getUsers, updateUser, deleteUser } from './services/firebase';

export default function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sexe, setSexe] = useState<'M' | 'F' | ''>('');
  const [users, setUsers] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (!name || !age || !sexe) return alert("Veuillez remplir tous les champs.");

    const user = {
      name,
      age: Number(age),
      sexe,
    };

    if (editingId) {
      await updateUser(editingId, user);
      setEditingId(null);
    } else {
      await addUser(user);
    }

    setName('');
    setAge('');
    setSexe('');
    fetchUsers();
  };

  const handleEdit = (item: any) => {
    setName(item.name);
    setAge(item.age.toString());
    setSexe(item.sexe);
    setEditingId(item.docId);
  };

  const handleDelete = async (docId: string) => {
    await deleteUser(docId);
    fetchUsers();
  };

  return (
    <View style={styles.container}>
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
           style={[
             styles.sexeButton,
             sexe === 'M' && styles.sexeButtonSelected,
           ]}
           onPress={() => setSexe('M')}
         >
           <Text style={styles.sexeText}>M</Text>
         </TouchableOpacity>

         <TouchableOpacity
           style={[
             styles.sexeButton,
             sexe === 'F' && styles.sexeButtonSelected,
           ]}
           onPress={() => setSexe('F')}
         >
           <Text style={styles.sexeText}>F</Text>
         </TouchableOpacity>
       </View>



      <Button title={editingId ? "Modifier" : "Ajouter"} onPress={handleSubmit} />

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
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.edit}>✏️ Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.docId)}>
                <Text style={styles.delete}>🗑️ Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5,
  },
  label: { fontSize: 16, marginBottom: 5 },
  sexButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  item: {
    backgroundColor: '#f2f2f2', padding: 10, marginVertical: 8, borderRadius: 8,
  },
  userText: { fontSize: 16 },
  actions: {
    flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5,
  },
  edit: { marginRight: 10, color: 'blue' },
  delete: { color: 'red' },


label: {
  marginBottom: 5,
  fontSize: 16,
  fontWeight: '500',
},

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
  backgroundColor: '#fff',
},

sexeButtonSelected: {
  borderColor: '#007AFF',
  backgroundColor: '#E6F0FF',
},

sexeText: {
  fontSize: 16,
  color: '#000',
},
});


