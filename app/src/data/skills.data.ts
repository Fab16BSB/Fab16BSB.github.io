import type { Skill } from '@/types/skill.types';

/**
 * Compétences affichées dans la section Skills.
 *
 * Élément de type `Skill`.
 *
 * @property {string} id - Identifiant stable.
 * @property {string} name - Nom affiché.
 * @property {SkillCategory} category - Catégorie de compétence.
 * @property {string} [icon] - Fichier dans app/public/images/skills/ (URL /images/skills/).
 * @property {string} [monogram] - Texte affiché si aucune icône n'est disponible.
 * @property {Localized} [context] - Contexte optionnel en FR / EN / ES.
 */
export const skills: Skill[] = [

  /** ▸ Langages */
  { id: 'python', name: 'Python', category: 'languages', icon: 'python.webp' },
  { id: 'java', name: 'Java', category: 'languages', icon: 'java.webp' },
  { id: 'javascript', name: 'JavaScript', category: 'languages', icon: 'js.webp' },
  { id: 'html', name: 'HTML', category: 'languages', icon: 'html.webp' },
  { id: 'css', name: 'CSS', category: 'languages', icon: 'css.webp' },

  /** ▸ Librairies & frameworks */
  { id: 'react', name: 'React', category: 'libraries', icon: 'react.svg' },
  { id: 'tensorflow', name: 'TensorFlow', category: 'libraries', icon: 'tensorflow.webp' },
  { id: 'keras', name: 'Keras', category: 'libraries', icon: 'keras.webp' },
  { id: 'sklearn', name: 'scikit-learn', category: 'libraries', icon: 'sklearn.webp' },
  { id: 'pandas', name: 'Pandas', category: 'libraries', icon: 'pandas.svg' },
  { id: 'numpy', name: 'NumPy', category: 'libraries', icon: 'numpy.svg' },
  { id: 'opencv', name: 'OpenCV', category: 'libraries', icon: 'opencv.svg' },
  { id: 'nltk', name: 'NLTK', category: 'libraries', monogram: 'NLTK' },
  { id: 'seaborn', name: 'Seaborn', category: 'libraries', icon: 'seaborn.svg' },
  { id: 'matplotlib', name: 'Matplotlib', category: 'libraries', icon: 'matplotlib.svg' },

  /** ▸ LLM & RAG */
  { id: 'langchain', name: 'LangChain', category: 'llm', icon: 'langchain.svg' },
  { id: 'huggingface', name: 'Hugging Face', category: 'llm', icon: 'huggingface.svg' },
  { id: 'ollama', name: 'Ollama', category: 'llm', icon: 'ollama.svg' },
  { id: 'mistral', name: 'Mistral AI', category: 'llm', icon: 'mistral.svg' },
  { id: 'gemini', name: 'Gemini', category: 'llm', icon: 'gemini.svg' },

  /** ▸ Bases de données & recherche */
  { id: 'sql', name: 'SQL', category: 'databases', icon: 'sql.webp' },
  { id: 'mysql', name: 'MySQL', category: 'databases', icon: 'mysql.svg' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'databases', icon: 'postgresql.svg' },
  { id: 'chromadb', name: 'ChromaDB', category: 'databases', icon: 'chromadb.svg' },
  { id: 'elasticsearch', name: 'Elasticsearch', category: 'databases', icon: 'elasticsearch.svg' },

  /** ▸ Déploiement & MLOps */
  { id: 'docker', name: 'Docker', category: 'deployment', icon: 'docker.svg' },
  { id: 'api-rest', name: 'API REST', category: 'deployment', icon: 'api.svg' },
  { id: 'swagger', name: 'Swagger', category: 'deployment', icon: 'swagger.svg' },
  { id: 'flask', name: 'Flask', category: 'deployment', icon: 'flask.svg' },
  { id: 'mlflow', name: 'MLflow', category: 'deployment', icon: 'mlflow.svg' },

  /** ▸ Outils & méthodes */
  { id: 'git', name: 'Git', category: 'tools', icon: 'git.webp' },
  { id: 'pytest', name: 'Pytest', category: 'tools', icon: 'pytest.svg' },
  { id: 'junit', name: 'JUnit', category: 'tools', icon: 'junit.svg' },
  { id: 'latex', name: 'LaTeX', category: 'tools', icon: 'latex.webp' },
  { id: 'uml', name: 'UML', category: 'tools', icon: 'uml.webp' },
  { id: 'mvc', name: 'MVC', category: 'tools', monogram: 'MVC' },
  { id: 'poo', name: 'POO', category: 'tools', monogram: 'OOP' },
  { id: 'jupyter', name: 'Jupyter', category: 'tools', icon: 'jupyter.webp' },
];
