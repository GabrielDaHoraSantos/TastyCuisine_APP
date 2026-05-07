// src/data/recipes.ts
export interface Recipe {
  id: string;
  name: string;
  chef: string;
  image: string;
  description: string;
  ingredients: string[];
  steps: string[];
  videoUrl: string;
  prepareTime?: string;
  baseServings: number;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  user: string;
  rating: number;
  text: string;
  date: string;
}

export const FEATURED_DISHES: Recipe[] = [
  {
    id: '1',
    name: 'Panqueca de banana',
    chef: 'Chef Carlos',
    prepareTime: '20 minutos',
    image: 'https://th.bing.com/th/id/OIP.lxtrvfRDySFiXtqY5m7EYgHaFD?w=233&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
    description: 'Uma deliciosa panqueca de banana, perfeita para um café da manhã saudável e energético.',
    ingredients: ['2 bananas maduras', '2 ovos', '1/2 xícara de aveia', 'Canela a gosto'],
    steps: ['Amasse bem as bananas em uma tigela.', 'Adicione os ovos e a aveia, misturando até ficar homogêneo.', 'Aqueça uma frigideira antiaderente e despeje pequenas porções.', 'Doure dos dois lados e sirva com mel.'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    baseServings: 1,
    comments: [
      { id: 'c1', user: 'Raviel', rating: 5, text: 'Eu tava precisando de receitas faceis e portateis pois saio muito e essa panqueca alem disson tudo e deliciosa', date: new Date().toISOString() }
    ]
  },
  {
    id: '2',
    name: 'Bolo de Limão',
    chef: 'Chef Gabriel',
    prepareTime: '55 minutos',
    image: 'https://th.bing.com/th/id/OIP.8XEg31oUEArxCoj9-BQxCAHaEK?w=298&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
    description: 'Um bolo cítrico e refrescante, ideal para qualquer ocasião, com um toque especial de limão.',
    ingredients: ['3 ovos', '2 xícaras de açúcar', '3 xícaras de farinha', 'Suco de 2 limões', '1 colher de fermento'],
    steps: ['Bata os ovos com o açúcar até dobrar de volume.', 'Adicione o suco de limão e a farinha peneirada aos poucos.', 'Por fim, misture o fermento delicadamente.', 'Asse em forno pré-aquecido a 180°C por 40 minutos.'],
    videoUrl: '',
    baseServings: 1,
    comments: [
      { id: 'c2', user: 'Barto', rating: 5, text: 'Que bolo incrivel, nunca havia provado porem meu colega que enviou a receita fez e me surpreendi fazendo aqui em casa', date: new Date().toISOString() }
    ]
  },
  {
    id: '3',
    name: 'Bolo de Cenoura',
    chef: 'Chef Lucas',
    prepareTime: '55 minutos',
    image: 'https://th.bing.com/th/id/OIP.ykvAWmcHAKz3ytqFziDn-gHaE8?w=249&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
    description: 'Um bolo delicioso e úmido, com o sabor característico da cenoura e uma cobertura saborosa de calda de chocolate.',
    ingredients: [
      '2 cenouras médias',
      '1/2 xícara de óleo',
      '3 ovos',
      '1/2 xícara de amido de milho',
      '1 e 1/2 xícara de farinha de trigo',
      '1 colher de fermento',
      '1 xícara de açúcar'
    ],
    steps: [
      'Preaqueça o forno a 180°C.',
      'Bata cenoura, óleo e ovos no liquidificador.',
      'Misture os secos em uma tigela e adicione o líquido.',
      'Asse por 35 minutos.'
    ],
    videoUrl: '',
    baseServings: 1,
    comments: [
      { id: 'c3', user: 'Josselyn', rating: 5, text: 'Tava precisando de um bolo que todos de uma festa gostassem e eu achei nessa receita, agora ja terminei a festa e foi um sucesso!', date: new Date().toISOString() }
    ]
  },
  {
    id: '4',
    name: 'Tacos Mexicanos',
    chef: 'Chef Ana',
    prepareTime: '25 minutos',
    image: 'https://th.bing.com/th/id/OIP.Z8d_kHqE5VvQQvhqYqN_QAHaE8?w=263&h=180&c=7&r=0&o=5&pid=1.7',
    description: 'Tacos crocantes recheados com carne temperada, alface, tomate e queijo. Perfeito para um jantar rápido e saboroso.',
    ingredients: ['500g de carne moída', '1 pacote de tempero para tacos', '8 tortilhas', 'Alface picada', 'Tomate picado', 'Queijo ralado', 'Creme azedo'],
    steps: ['Refogue a carne moída até dourar.', 'Adicione o tempero e um pouco de água, cozinhe por 5 minutos.', 'Aqueça as tortilhas.', 'Monte os tacos com carne, alface, tomate, queijo e creme azedo.'],
    videoUrl: '',
    baseServings: 4,
    comments: [
      { id: 'c4', user: 'Miguel', rating: 5, text: 'Receita simples e deliciosa! Toda a família adorou.', date: new Date().toISOString() }
    ]
  },
  {
    id: '5',
    name: 'Smoothie de Morango',
    chef: 'Chef Ana',
    prepareTime: '5 minutos',
    image: 'https://th.bing.com/th/id/OIP.fN8vYqGqE_Qs5VqQqN_QAHaLH?w=115&h=180&c=7&r=0&o=5&pid=1.7',
    description: 'Um smoothie refrescante e nutritivo, perfeito para começar o dia com energia e sabor.',
    ingredients: ['1 xícara de morangos congelados', '1 banana', '1/2 xícara de iogurte natural', '1/2 xícara de leite', '1 colher de mel'],
    steps: ['Coloque todos os ingredientes no liquidificador.', 'Bata até ficar homogêneo e cremoso.', 'Sirva imediatamente.'],
    videoUrl: '',
    baseServings: 1,
    comments: [
      { id: 'c5', user: 'Carla', rating: 5, text: 'Perfeito para o café da manhã! Super rápido e gostoso.', date: new Date().toISOString() }
    ]
  },
  {
    id: '6',
    name: 'Lasanha à Bolonhesa',
    chef: 'Chef Pedro',
    prepareTime: '90 minutos',
    image: 'https://th.bing.com/th/id/OIP.Xm8vYqGqE_Qs5VqQqN_QAHaE8?w=263&h=180&c=7&r=0&o=5&pid=1.7',
    description: 'Uma lasanha clássica com molho bolonhesa caseiro, queijo derretido e massa al dente. Perfeita para reunir a família.',
    ingredients: ['500g de massa para lasanha', '500g de carne moída', '1 cebola picada', '2 dentes de alho', '500ml de molho de tomate', '500g de queijo mussarela', '200g de presunto', 'Queijo parmesão ralado'],
    steps: ['Refogue a cebola e alho, adicione a carne e o molho de tomate.', 'Cozinhe a massa conforme instruções da embalagem.', 'Monte camadas alternando massa, molho, presunto e queijo.', 'Finalize com queijo parmesão e asse por 40 minutos a 180°C.'],
    videoUrl: '',
    baseServings: 6,
    comments: [
      { id: 'c6', user: 'Roberto', rating: 5, text: 'A melhor lasanha que já fiz! Demorou mas valeu a pena.', date: new Date().toISOString() }
    ]
  },
  {
    id: '7',
    name: 'Pão de Queijo',
    chef: 'Chef Maria',
    prepareTime: '30 minutos',
    image: 'https://th.bing.com/th/id/OIP.8m8vYqGqE_Qs5VqQqN_QAHaE8?w=263&h=180&c=7&r=0&o=5&pid=1.7',
    description: 'Pão de queijo mineiro tradicional, crocante por fora e macio por dentro. Irresistível!',
    ingredients: ['500g de polvilho azedo', '1 xícara de leite', '1/2 xícara de óleo', '2 ovos', '200g de queijo minas ralado', '1 colher de sal'],
    steps: ['Ferva o leite com óleo e sal.', 'Despeje sobre o polvilho e misture bem.', 'Adicione os ovos e o queijo, amasse até ficar homogêneo.', 'Faça bolinhas e asse a 180°C por 25 minutos.'],
    videoUrl: '',
    baseServings: 20,
    comments: [
      { id: 'c7', user: 'Fernanda', rating: 5, text: 'Ficou perfeito! Igual da padaria.', date: new Date().toISOString() }
    ]
  },
  {
    id: '8',
    name: 'Salada Caesar',
    chef: 'Chef Pedro',
    prepareTime: '15 minutos',
    image: 'https://th.bing.com/th/id/OIP.Zm8vYqGqE_Qs5VqQqN_QAHaE8?w=263&h=180&c=7&r=0&o=5&pid=1.7',
    description: 'Salada clássica com alface romana, croutons crocantes, parmesão e molho caesar cremoso.',
    ingredients: ['1 pé de alface romana', '100g de croutons', '50g de queijo parmesão', '2 filés de frango grelhado', 'Molho caesar', 'Suco de limão'],
    steps: ['Lave e corte a alface em pedaços.', 'Grelhe o frango e corte em tiras.', 'Misture alface, frango, croutons e parmesão.', 'Regue com molho caesar e suco de limão.'],
    videoUrl: '',
    baseServings: 2,
    comments: [
      { id: 'c8', user: 'Amanda', rating: 4, text: 'Muito boa! Adicionei bacon e ficou ainda melhor.', date: new Date().toISOString() }
    ]
  },
  {
    id: '9',
    name: 'Brigadeiro Gourmet',
    chef: 'Chef Juliana',
    prepareTime: '20 minutos',
    image: 'https://th.bing.com/th/id/OIP.Pm8vYqGqE_Qs5VqQqN_QAHaE8?w=263&h=180&c=7&r=0&o=5&pid=1.7',
    description: 'Brigadeiro cremoso e irresistível, perfeito para festas ou para matar aquela vontade de doce.',
    ingredients: ['1 lata de leite condensado', '3 colheres de chocolate em pó', '1 colher de manteiga', 'Chocolate granulado para decorar'],
    steps: ['Em uma panela, misture leite condensado, chocolate e manteiga.', 'Cozinhe em fogo baixo mexendo sempre até desgrudar do fundo.', 'Deixe esfriar e faça bolinhas.', 'Passe no chocolate granulado.'],
    videoUrl: '',
    baseServings: 30,
    comments: [
      { id: 'c9', user: 'Lucas', rating: 5, text: 'Fiz para o aniversário e todo mundo pediu a receita!', date: new Date().toISOString() }
    ]
  },
  {
    id: '10',
    name: 'Risoto de Cogumelos',
    chef: 'Chef Ricardo',
    prepareTime: '45 minutos',
    image: 'https://th.bing.com/th/id/OIP.Qm8vYqGqE_Qs5VqQqN_QAHaE8?w=263&h=180&c=7&r=0&o=5&pid=1.7',
    description: 'Risoto cremoso com cogumelos frescos, vinho branco e parmesão. Um prato sofisticado e delicioso.',
    ingredients: ['300g de arroz arbóreo', '200g de cogumelos variados', '1 cebola picada', '100ml de vinho branco', '1 litro de caldo de legumes', '50g de manteiga', 'Queijo parmesão ralado'],
    steps: ['Refogue a cebola na manteiga, adicione o arroz.', 'Adicione o vinho e deixe evaporar.', 'Vá adicionando o caldo aos poucos, mexendo sempre.', 'Adicione os cogumelos salteados e finalize com parmesão.'],
    videoUrl: '',
    baseServings: 4,
    comments: [
      { id: 'c10', user: 'Patricia', rating: 5, text: 'Receita de restaurante! Impressionei meus convidados.', date: new Date().toISOString() }
    ]
  },
  {
    id: '11',
    name: 'Wrap de Frango',
    chef: 'Chef Ana',
    prepareTime: '20 minutos',
    image: 'https://th.bing.com/th/id/OIP.Rm8vYqGqE_Qs5VqQqN_QAHaE8?w=263&h=180&c=7&r=0&o=5&pid=1.7',
    description: 'Wrap saudável e prático com frango grelhado, vegetais frescos e molho especial.',
    ingredients: ['2 tortilhas grandes', '200g de peito de frango', 'Alface', 'Tomate', 'Cenoura ralada', 'Molho de iogurte', 'Temperos a gosto'],
    steps: ['Tempere e grelhe o frango, depois corte em tiras.', 'Aqueça as tortilhas.', 'Distribua alface, tomate, cenoura e frango.', 'Regue com molho de iogurte e enrole.'],
    videoUrl: '',
    baseServings: 2,
    comments: [
      { id: 'c11', user: 'Diego', rating: 4, text: 'Ótimo para levar no trabalho! Prático e gostoso.', date: new Date().toISOString() }
    ]
  },
  {
    id: '12',
    name: 'Torta de Maçã',
    chef: 'Chef Juliana',
    prepareTime: '70 minutos',
    image: 'https://th.bing.com/th/id/OIP.Sm8vYqGqE_Qs5VqQqN_QAHaE8?w=263&h=180&c=7&r=0&o=5&pid=1.7',
    description: 'Torta de maçã clássica com massa amanteigada e recheio de maçãs com canela. Perfeita para sobremesa.',
    ingredients: ['3 xícaras de farinha', '200g de manteiga', '1 ovo', '5 maçãs', '1 xícara de açúcar', 'Canela em pó', 'Suco de limão'],
    steps: ['Prepare a massa misturando farinha, manteiga e ovo.', 'Descasque e corte as maçãs, misture com açúcar, canela e limão.', 'Forre uma forma com a massa, adicione o recheio.', 'Cubra com tiras de massa e asse a 180°C por 45 minutos.'],
    videoUrl: '',
    baseServings: 8,
    comments: [
      { id: 'c12', user: 'Beatriz', rating: 5, text: 'A casa ficou com um cheiro maravilhoso! Torta perfeita.', date: new Date().toISOString() }
    ]
  },
  {
    id: '13',
    name: 'Hambúrguer Artesanal',
    chef: 'Chef Ricardo',
    prepareTime: '30 minutos',
    image: 'https://th.bing.com/th/id/OIP.Tm8vYqGqE_Qs5VqQqN_QAHaE8?w=263&h=180&c=7&r=0&o=5&pid=1.7',
    description: 'Hambúrguer suculento feito em casa com carne de qualidade, queijo derretido e molho especial.',
    ingredients: ['500g de carne moída', '4 pães de hambúrguer', 'Queijo cheddar', 'Alface', 'Tomate', 'Cebola roxa', 'Picles', 'Molho especial', 'Sal e pimenta'],
    steps: ['Tempere a carne e faça 4 hambúrgueres.', 'Grelhe os hambúrgueres por 4 minutos de cada lado.', 'Adicione queijo e deixe derreter.', 'Monte o hambúrguer com pão, alface, tomate, cebola, picles e molho.'],
    videoUrl: '',
    baseServings: 4,
    comments: [
      { id: 'c13', user: 'Thiago', rating: 5, text: 'Melhor que de lanchonete! Ficou suculento e saboroso.', date: new Date().toISOString() }
    ]
  },
  {
    id: '14',
    name: 'Mousse de Chocolate',
    chef: 'Chef Maria',
    prepareTime: '15 minutos',
    image: 'https://th.bing.com/th/id/OIP.Um8vYqGqE_Qs5VqQqN_QAHaE8?w=263&h=180&c=7&r=0&o=5&pid=1.7',
    description: 'Mousse de chocolate cremoso e aerado, uma sobremesa clássica que agrada a todos.',
    ingredients: ['200g de chocolate meio amargo', '3 ovos', '2 colheres de açúcar', '1 caixinha de creme de leite'],
    steps: ['Derreta o chocolate em banho-maria.', 'Separe as claras das gemas.', 'Misture as gemas ao chocolate, adicione o creme de leite.', 'Bata as claras em neve com açúcar e incorpore delicadamente.', 'Leve à geladeira por 2 horas.'],
    videoUrl: '',
    baseServings: 6,
    comments: [
      { id: 'c14', user: 'Isabela', rating: 5, text: 'Sobremesa perfeita! Leve e deliciosa.', date: new Date().toISOString() }
    ]
  },
  {
    id: '15',
    name: 'Sopa de Legumes',
    chef: 'Chef Pedro',
    prepareTime: '40 minutos',
    image: 'https://th.bing.com/th/id/OIP.Vm8vYqGqE_Qs5VqQqN_QAHaE8?w=263&h=180&c=7&r=0&o=5&pid=1.7',
    description: 'Sopa nutritiva e reconfortante com legumes frescos. Perfeita para dias frios.',
    ingredients: ['2 batatas', '2 cenouras', '1 abobrinha', '1 cebola', '2 dentes de alho', '1 litro de caldo de legumes', 'Sal e pimenta', 'Azeite'],
    steps: ['Refogue a cebola e alho no azeite.', 'Adicione os legumes picados.', 'Cubra com o caldo e cozinhe por 30 minutos.', 'Tempere a gosto e sirva quente.'],
    videoUrl: '',
    baseServings: 4,
    comments: [
      { id: 'c15', user: 'Mariana', rating: 5, text: 'Sopa deliciosa e saudável! Perfeita para o inverno.', date: new Date().toISOString() }
    ]
  },
  {
    id: '16',
    name: 'Pizza Margherita',
    chef: 'Chef Lucas',
    prepareTime: '120 minutos',
    image: 'https://th.bing.com/th/id/OIP.Wm8vYqGqE_Qs5VqQqN_QAHaE8?w=263&h=180&c=7&r=0&o=5&pid=1.7',
    description: 'Pizza clássica italiana com molho de tomate, mussarela e manjericão fresco. Simples e deliciosa.',
    ingredients: ['500g de farinha', '10g de fermento biológico', '300ml de água morna', '1 colher de açúcar', 'Sal', 'Azeite', 'Molho de tomate', 'Mussarela', 'Manjericão'],
    steps: ['Prepare a massa misturando farinha, fermento, água, açúcar e sal.', 'Deixe descansar por 1 hora até dobrar de tamanho.', 'Abra a massa, adicione molho e mussarela.', 'Asse em forno bem quente (250°C) por 12 minutos.', 'Finalize com manjericão fresco.'],
    videoUrl: '',
    baseServings: 4,
    comments: [
      { id: 'c16', user: 'Rafael', rating: 5, text: 'Massa perfeita! Crocante e saborosa como de pizzaria.', date: new Date().toISOString() }
    ]
  },
  {
    id: '17',
    name: 'Omelete de Queijo',
    chef: 'Chef Maria',
    prepareTime: '10 minutos',
    image: 'https://th.bing.com/th/id/OIP.Xm8vYqGqE_Qs5VqQqN_QAHaE8?w=263&h=180&c=7&r=0&o=5&pid=1.7',
    description: 'Omelete fofinho e recheado com queijo derretido. Perfeito para um café da manhã rápido.',
    ingredients: ['3 ovos', '50g de queijo ralado', '2 colheres de leite', 'Sal e pimenta', 'Manteiga'],
    steps: ['Bata os ovos com leite, sal e pimenta.', 'Aqueça uma frigideira com manteiga.', 'Despeje os ovos e deixe cozinhar.', 'Adicione o queijo, dobre ao meio e sirva.'],
    videoUrl: '',
    baseServings: 1,
    comments: [
      { id: 'c17', user: 'Camila', rating: 4, text: 'Rápido e gostoso! Faço toda semana.', date: new Date().toISOString() }
    ]
  },
  {
    id: '18',
    name: 'Brownie de Chocolate',
    chef: 'Chef Juliana',
    prepareTime: '40 minutos',
    image: 'https://th.bing.com/th/id/OIP.Ym8vYqGqE_Qs5VqQqN_QAHaE8?w=263&h=180&c=7&r=0&o=5&pid=1.7',
    description: 'Brownie denso e úmido com muito chocolate. Irresistível para os amantes de chocolate.',
    ingredients: ['200g de chocolate meio amargo', '150g de manteiga', '3 ovos', '1 xícara de açúcar', '1/2 xícara de farinha', '1/2 xícara de cacau em pó'],
    steps: ['Derreta o chocolate com a manteiga.', 'Bata os ovos com açúcar até ficar cremoso.', 'Misture o chocolate derretido aos ovos.', 'Adicione farinha e cacau peneirados.', 'Asse a 180°C por 25 minutos.'],
    videoUrl: '',
    baseServings: 12,
    comments: [
      { id: 'c18', user: 'Gustavo', rating: 5, text: 'O melhor brownie que já comi! Ficou perfeito.', date: new Date().toISOString() }
    ]
  }
];