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
 * @property {EducationId[]} [educationIds] - Formations pendant lesquelles la compétence a été utilisée.
 * @property {ExperienceId[]} [experienceIds] - Expériences pendant lesquelles la compétence a été utilisée.
 */
export const skills: Skill[] = [

  /** ▸ Langages */
  { id: 'python', name: 'Python', category: 'languages', icon: 'python.webp', educationIds: ['master'] },
  { id: 'java', name: 'Java', category: 'languages', icon: 'java.webp', educationIds: ['dut'] },
  { id: 'javascript', name: 'JavaScript', category: 'languages', icon: 'js.webp', educationIds: ['dut'] },
  { id: 'html', name: 'HTML', category: 'languages', icon: 'html.webp', educationIds: ['dut'] },
  { id: 'css', name: 'CSS', category: 'languages', icon: 'css.webp', educationIds: ['dut'] },

  /** ▸ Librairies & frameworks */
  { id: 'react', name: 'React', category: 'libraries', icon: 'react.svg', experienceIds: ['ater-paris8'] },
  { id: 'tensorflow', name: 'TensorFlow', category: 'libraries', icon: 'tensorflow.webp', educationIds: ['master'] },
  { id: 'keras', name: 'Keras', category: 'libraries', icon: 'keras.webp', educationIds: ['master'] },
  { id: 'sklearn', name: 'scikit-learn', category: 'libraries', icon: 'sklearn.webp', educationIds: ['master'] },
  { id: 'pandas', name: 'Pandas', category: 'libraries', icon: 'pandas.svg', educationIds: ['master'] },
  { id: 'numpy', name: 'NumPy', category: 'libraries', icon: 'numpy.svg', educationIds: ['master'] },
  { id: 'opencv', name: 'OpenCV', category: 'libraries', icon: 'opencv.svg', educationIds: ['phd'], experienceIds: ['these-othello'] },
  { id: 'nltk', name: 'NLTK', category: 'libraries', monogram: 'NLTK', educationIds: ['master'] },
  { id: 'seaborn', name: 'Seaborn', category: 'libraries', icon: 'seaborn.svg', educationIds: ['master'] },
  { id: 'matplotlib', name: 'Matplotlib', category: 'libraries', icon: 'matplotlib.svg', educationIds: ['master'] },

  /** ▸ LLM & RAG */
  { id: 'langchain', name: 'LangChain', category: 'llm', icon: 'langchain.svg', experienceIds: ['ater-paris8'] },
  { id: 'huggingface', name: 'Hugging Face', category: 'llm', icon: 'huggingface.svg', experienceIds: ['ater-paris8'] },
  { id: 'ollama', name: 'Ollama', category: 'llm', icon: 'ollama.svg', experienceIds: ['ater-paris8'] },
  { id: 'mistral', name: 'Mistral AI', category: 'llm', icon: 'mistral.svg', experienceIds: ['freelance-leasup'] },
  { id: 'gemini', name: 'Gemini', category: 'llm', icon: 'gemini.svg', experienceIds: ['freelance-leasup'] },

  /** ▸ Bases de données & recherche */
  { id: 'sql', name: 'SQL', category: 'databases', icon: 'sql.webp', educationIds: ['dut'] },
  { id: 'mysql', name: 'MySQL', category: 'databases', icon: 'mysql.svg', educationIds: ['dut'] },
  { id: 'postgresql', name: 'PostgreSQL', category: 'databases', icon: 'postgresql.svg', educationIds: ['dut'] },
  { id: 'chromadb', name: 'ChromaDB', category: 'databases', icon: 'chromadb.svg', experienceIds: ['ater-paris8'] },
  { id: 'elasticsearch', name: 'Elasticsearch', category: 'databases', icon: 'elasticsearch.svg', experienceIds: ['freelance-leasup'] },

  /** ▸ Déploiement & MLOps */
  { id: 'docker', name: 'Docker', category: 'deployment', icon: 'docker.svg', experienceIds: ['ater-paris8'] },
  { id: 'api-rest', name: 'API REST', category: 'deployment', icon: 'api.svg', experienceIds: ['freelance-leasup'] },
  { id: 'swagger', name: 'Swagger', category: 'deployment', icon: 'swagger.svg', experienceIds: ['ater-paris8'] },
  { id: 'flask', name: 'Flask', category: 'deployment', icon: 'flask.svg', experienceIds: ['ater-paris8'] },
  { id: 'mlflow', name: 'MLflow', category: 'deployment', icon: 'mlflow.svg' },

  /** ▸ Outils & méthodes */
  { id: 'git', name: 'Git', category: 'tools', icon: 'git.webp', experienceIds: ['ater-paris8'] },
  { id: 'pytest', name: 'Pytest', category: 'tools', icon: 'pytest.svg', experienceIds: ['freelance-leasup'] },
  { id: 'junit', name: 'JUnit', category: 'tools', icon: 'junit.svg', educationIds: ['dut'] },
  { id: 'latex', name: 'LaTeX', category: 'tools', icon: 'latex.webp', educationIds: ['master'] },
  { id: 'uml', name: 'UML', category: 'tools', icon: 'uml.webp', educationIds: ['dut'] },
  { id: 'mvc', name: 'MVC', category: 'tools', monogram: 'MVC', educationIds: ['dut'] },
  { id: 'poo', name: 'POO', category: 'tools', monogram: 'OOP', educationIds: ['dut'] },
  { id: 'jupyter', name: 'Jupyter', category: 'tools', icon: 'jupyter.webp', educationIds: ['master'] },
];
