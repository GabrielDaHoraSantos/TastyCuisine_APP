import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '../themeContext';     

const FEATURED_DISHES = [
  {
    id: '1',
    name: 'Panqueca de banana',
    chef: 'Chef Carlos',
    image: 'https://th.bing.com/th/id/OIP.lxtrvfRDySFiXtqY5m7EYgHaFD?w=233&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
    description: 'Uma Panqueca de banana delliciosa, para fazerde café da manhã, de lanche ou de sobremesa',
    ingredients: ['2 bananas', '2 ovos', '1 colher (sopa) de açúcar', '5 colheres (sopa) de farinha de trigo com fermento', '1/2 xícara (chá) de  leite'],
    steps: ['Em uma vasilha, amasse as duas bananas com a ajuda de um garfo, junte os dois ovos, o açúcar e misture bem.', 'Acrescente a farinha de trigo, uma colher de cada vez, misturando para não empelotar.', 'Por último coloque o leite, mexendo até obter uma massa homogênea.', 'Coloque uma concha da massa no centro de uma frigideira antiaderente, devagar para que a massa não se espalhe muito (se preferir pode ir moldando com a ajuda de uma colher).', 'Deixe dourar e com a ajuda de uma espátula vire e doure o outro lado.', 'Pronto, é só servir acompanhada de chocolate derretido em cima ou ainda bacon frito e ovos, excelente pedida para o café da manhã!'],
    videoUrl: 'https://www.tudogostoso.com.br/receita/181793-panqueca-de-banana.html',
  },

  {
    id: '2',
    name: 'Bolo de Limão',
    chef: 'Chef Gabriel',
    image: 'https://th.bing.com/th/id/OIP.8XEg31oUEArxCoj9-BQxCAHaEK?w=298&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
    description: 'Um bolo de limão super leve e refrescante, perfeito para o verão ou para acompanhar um café à tarde.',
    ingredients: ['Massa', '4 ovos', '1/2 copo de óleo', '2 copos de açúcar, não muito cheios', '1 copo de leite', '1 caixa de gelatina de limão', '2 xícaras de farinha de trigo', '1 colher de sopa de Fermento em pó', 'Corbetura e Recheio', '1 lata de leite condensado', 'Suco de 3 limões'],
    steps: ['Massa', 'Bata no liquidificador os ovos inteiros, o óleo e o açúcar (bem batidos).', 'Coloque a gelatina e continue batendo até dissolver.', 'Despeje em uma tigela e acrescente a farinha e o fermento em pó, mexendo sempre, colocando o leite.', 'Coloque em assadeira untada e polvilhada com farinha.', 'Coloque em assadeira untada e polvilhada com farinha.', 'Depois de assado e ainda quente, fure com o garfo.', 'Cobertura', 'Bata no liquidificador ou na mão o leite condensado com suco de 3 limões até formar uma cobertura homogênea.'],
    videoUrl: 'https://www.tudogostoso.com.br/receita/105428-bolo-verde-de-limao.html',
  },

  {
    id: '3',
    nae: 'Bolo de Cenoura com calda de chocolate',
    chef: 'Chef Lucas',
    image: 'https://th.bing.com/th/id/OIP.ykvAWmcHAKz3ytqFziDn-gHaE8?w=249&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
    description: '',
    ingredients: ['Massa', '2 cenouras médias, cortadas em cubos médios (250 g)',
      '1/2 xícara (chá) de óleo',
      '3 ovos',
      '1/2 xícara (chá) de amido de milho MAIZENA',
      '1 e 1/2 xícara (chá) de farinha de trigo',
      '1 colher (sopa) de fermento em pó',
      '1 xícara (chá) de açúcar',
      'Cobertura',
      '1/2 xícara (chá) de chocolate ao leite derretido (ainda quente)',
      '1/2 xícara (chá) de creme de leite',
    ],
    steps: [
      'Preaqueça o forno em temperatura média (180°C).',
      'Unte e enfarinhe uma forma de furo central média (20 cm de diâmetro).',
      'Reserve.',
      'No copo do liquidificador, coloque a cenoura, o óleo e os ovos, e bata até ficar homogêneo.',
      'Em uma tigela, peneire o amido de milho MAIZENA®, a farinha de trigo, o fermento e o açúcar, junte a mistura de cenoura reservada, e mexa com o auxílio de uma espátula até que vire uma massa uniforme.',
      'Disponha a massa na forma reservada e leve ao forno por 35 minutos, ou até que um palito, depois de espetado na massa, saia limpo.',
      'Retire do forno e deixe amornar.',
      'Cobertura',
      'Misture o chocolate e o creme de leite, espalhe por toda a superfície do bolo e sirva a seguir.',
      'Dica:',
      'Se preferir, utilize a forma redonda canelada (18 cm de diâmetro)'

    ],
    videoUrl: '',
  },
]



export default function HomeScreen() {
  const { theme, toggleMode } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Gourmet!</Text>
        <Text style={styles.subtitle}>O que vamos saborear hoje?</Text>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Buscar pratos ou chefs..."
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Destaques da Semana</Text>
        <FlatList
          data={FEATURED_DISHES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            /* O Link envolve o card e passa os dados do prato como parâmetros */
            <Link
              href={{
                pathname: "/dish/[id]",
                params: {
                  id: item.id,
                  name: item.name,
                  chef: item.chef,
                  image: item.image,
                  description: item.description,
                  ingredients: JSON.stringify(item.ingredients), // Convertido para string JSON
                  steps: JSON.stringify(item.steps),             // Convertido para string JSON
                  videoUrl: item.videoUrl
                }
              }}
              asChild
            >
              <TouchableOpacity style={styles.dishCard}>
                <Image source={{ uri: item.image }} style={styles.dishImage} />
                <View style={styles.dishInfo}>
                  <Text style={styles.dishName}>{item.name}</Text>
                  <Text style={styles.dishChef}>{item.chef}</Text>

                </View>
              </TouchableOpacity>
            </Link>
          )}
        />


        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Categorias Populares</Text>
        {/* Aqui você pode adicionar mais listas ou componentes conforme o Figma */}
      </ScrollView>
    </View>
  );
}
 

  const { theme, toggleMode } = useTheme();

const styles = StyleSheet.create({
  container: { 
      flex: 1, 
      backgroundColor: theme.background.primary, // <-- Usando cor do tema
      padding: 20, 
      paddingTop: 50 
    },
    header: {
      marginBottom: 20
    },
    greeting: { 
      fontSize: 24, 
      fontWeight: 'bold', 
      color: theme.primary // <-- Usando cor do tema (ex: F8D775 ou roxo/azul)
    },
    subtitle: { 
      fontSize: 16, 
      color: theme.text.secondary // <-- Usando cor do tema
    },
    searchBar: { 
      backgroundColor: theme.background.secondary, // <-- Usando cor do tema
      borderRadius: 12, 
      paddingHorizontal: 15, 
      height: 50, 
      justifyContent: 'center',
      marginBottom: 25,
      borderWidth: 1,
      borderColor: theme.text.secondary // <-- Usando cor do tema
    },
    searchInput: { 
      color: theme.text.primary, // <-- Usando cor do tema
      fontSize: 16 
    },
    sectionTitle: { 
      fontSize: 20, 
      fontWeight: 'bold', 
      color: theme.text.primary, // <-- Usando cor do tema
      marginBottom: 15 
    },
    dishCard: { 
      width: 200, 
      backgroundColor: theme.background.secondary, // <-- Usando cor do tema
      borderRadius: 15, 
      marginRight: 15,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.text.secondary // <-- Usando cor do tema
    },
    dishImage: { width: '100%', height: 120 },
    dishInfo: { padding: 12 },
    dishName: { 
      fontSize: 16, 
      fontWeight: 'bold', 
      color: theme.text.primary // <-- Usando cor do tema
    },
    dishChef: { 
      fontSize: 12, 
      color: theme.text.secondary, // <-- Usando cor do tema
      marginVertical: 4 
    },

    });
