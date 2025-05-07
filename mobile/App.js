import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import axios from 'axios';

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const API_URL = 'http://10.136.23.108/api';

  // Função para buscar todos os produtos
  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/produtos`);
      setProdutos(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError('Falha ao carregar produtos. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar detalhes de um produto específico
  const fetchProdutoDetalhe = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/produtos/${id}`);
      setSelectedProduct(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar detalhes do produto:', err);
      setError('Falha ao carregar detalhes do produto.');
    } finally {
      setLoading(false);
    }
  };

  // Carrega os produtos quando o componente é montado
  useEffect(() => {
    fetchProdutos();
  }, []);

  // Renderiza cada item da lista
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => fetchProdutoDetalhe(item.id)}
    >
      <Text style={styles.productName}>{item.nome}</Text>
      <Text style={styles.productPrice}>R$ {item.preco.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Produtos</Text>
        {selectedProduct && (
          <TouchableOpacity onPress={() => setSelectedProduct(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>Voltar à lista</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProdutos}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : selectedProduct ? (
        <View style={styles.detailContainer}>
          <Text style={styles.detailTitle}>{selectedProduct.nome}</Text>
          <Text style={styles.detailPrice}>R$ {selectedProduct.preco.toFixed(2)}</Text>
          <Text style={styles.detailDescription}>{selectedProduct.descricao}</Text>
        </View>
      ) : (
        <FlatList
          data={produtos}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#0066cc',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  productItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#0066cc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  detailContainer: {
    flex: 1,
    padding: 16,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailPrice: {
    fontSize: 20,
    color: '#0066cc',
    marginBottom: 16,
  },
  detailDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});