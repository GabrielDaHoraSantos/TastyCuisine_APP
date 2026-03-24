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
}

export const FEATURED_DISHES: Recipe[] = [
  {
    id: '1',
    name: 'Panqueca de banana',
    chef: 'Chef Carlos',
    image: 'https://th.bing.com/th/id/OIP.lxtrvfRDySFiXtqY5m7EYgHaFD?w=233&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
    description: 'Uma deliciosa panqueca de banana, perfeita para um café da manhã saudável e energético.',
    ingredients: ['2 bananas maduras', '2 ovos', '1/2 xícara de aveia', 'Canela a gosto'],
    steps: ['Amasse bem as bananas em uma tigela.', 'Adicione os ovos e a aveia, misturando até ficar homogêneo.', 'Aqueça uma frigideira antiaderente e despeje pequenas porções.', 'Doure dos dois lados e sirva com mel.'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: '2',
    name: 'Bolo de Limão',
    chef: 'Chef Gabriel',
    image: 'https://th.bing.com/th/id/OIP.8XEg31oUEArxCoj9-BQxCAHaEK?w=298&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
    description: 'Um bolo cítrico e refrescante, ideal para qualquer ocasião, com um toque especial de limão.',
    ingredients: ['3 ovos', '2 xícaras de açúcar', '3 xícaras de farinha', 'Suco de 2 limões', '1 colher de fermento'],
    steps: ['Bata os ovos com o açúcar até dobrar de volume.', 'Adicione o suco de limão e a farinha peneirada aos poucos.', 'Por fim, misture o fermento delicadamente.', 'Asse em forno pré-aquecido a 180°C por 40 minutos.'],
    videoUrl: ''
  },
  {
    id: '3',
    name: 'Bolo de Cenoura',
    chef: 'Chef Lucas',
    image: 'https://th.bing.com/th/id/OIP.ykvAWmcHAKz3ytqFziDn-gHaE8?w=249&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
    description: 'Um bolo delicioso e úmido, com o sabor característico da cenoura e uma cobertura saborosa de calda de chocolate.',
    ingredients: ['2 cenouras médias', '1/2 xícara de óleo', '3 ovos', '1/2 xícara de amido de milho', '1 e 1/2 xícara de farinha de trigo', '1 colher de fermento', '1 xícara de açúcar'],
    steps: ['Preaqueça o forno a 180°C.', 'Bata cenoura, óleo e ovos no liquidificador.', 'Misture os secos em uma tigela e adicione o líquido.', 'Asse por 35 minutos.'],
    videoUrl: ''
  },
];