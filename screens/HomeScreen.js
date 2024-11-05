import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from './firebaseConfig'; // Verifique se o caminho está correto
import { signOut } from 'firebase/auth';

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Armazena o usuário logado
      } else {
        navigation.navigate('Login'); // Redireciona para a tela de login se não houver usuário
      }
    });

    return () => unsubscribe(); // Limpa o listener ao desmontar o componente
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Sucesso', 'Logout realizado com sucesso!');
      navigation.navigate('Login'); // Redireciona para a tela de login após logout
    } catch (error) {
      console.error("Erro ao fazer logout: ", error.message);
      Alert.alert('Erro', 'Não foi possível realizar o logout.');
    }
  };

  const menuItems = [
    { title: 'Home', onPress: () => navigation.navigate('Home') },
    { title: 'Login', onPress: () => navigation.navigate('Login') },
    { title: 'Cadastro', onPress: () => navigation.navigate('Cadastro') },
    { title: 'Contato', onPress: () => alert('Entre em contato conosco!') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon} onPress={() => setModalVisible(true)}>
          <Icon name="bars" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.userName}>Olá, {user ? user.email : 'Visitante'}!</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Icon name="calculator" size={28} color="#0074d9" />
            <Text style={styles.cardTitle}>Calculadora Hídrica</Text>
            <Text style={styles.cardDescription}>Calcule seu consumo de água.</Text>
          </View>
          <View style={styles.card}>
            <Icon name="tint" size={28} color="#0074d9" />
            <Text style={styles.cardTitle}>Água Virtual</Text>
            <Text style={styles.cardDescription}>Entenda o conceito de água virtual.</Text>
          </View>
          <View style={styles.card}>
            <Icon name="users" size={28} color="#0074d9" />
            <Text style={styles.cardTitle}>Contato</Text>
            <Text style={styles.cardDescription}>Entre em contato conosco.</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={menuItems}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.menuItem} onPress={() => {
                  item.onPress();  // Chama a função de navegação
                  setModalVisible(false);  // Fecha o modal após a seleção
                }}>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#0074d9',
    elevation: 4,
    width: '100%',
  },
  menuIcon: {
    paddingRight: 16,
  },
  userName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    width: '30%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#0074d9',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
    marginVertical: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0074d9',
    marginTop: 10,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    width: '100%',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
    color: '#0074d9',
    fontSize: 16,
  },
});

export default HomeScreen;
