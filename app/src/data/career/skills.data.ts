import type { Skill } from '@/types/skill.types';

/**
 * Compétences affichées dans la section Skills.
 *
 * Élément de type `Skill`.
 *
 * @property {string} id - Identifiant stable.
 * @property {string} name - Nom affiché.
 * @property {string[]} [aliases] - Graphies reconnues en plus du nom, dans les stacks, les tags de cours et la recherche.
 * @property {SkillCategory} category - Catégorie de compétence.
 * @property {string[]} [conceptIds] - Concepts associés à la compétence, identifiants de `knowledgeConcepts`.
 * @property {string} [icon] - Fichier dans app/public/images/skills/ (URL /images/skills/).
 * @property {string} [monogram] - Texte affiché si aucune icône n'est disponible.
 * @property {Localized} [context] - Contexte optionnel en FR / EN / ES.
 * @property {EducationId[]} [educationIds] - Formations pendant lesquelles la compétence a été utilisée.
 * @property {ExperienceId[]} [experienceIds] - Expériences pendant lesquelles la compétence a été utilisée.
 * @property {string[]} [projectIds] - Projets où la compétence est utilisée.
 * @property {string[]} [mediumPostIds] - Articles Medium associés.
 */
export const skills: Skill[] = [

  /** ▸ Langages */
  { id: 'python', name: 'Python', category: 'languages', icon: 'python.webp', educationIds: ['master'], conceptIds: ['programming'] },
  { id: 'java', name: 'Java', category: 'languages', icon: 'java.webp', educationIds: ['dut'], conceptIds: ['programming', 'oop'] },
  { id: 'javascript', name: 'JavaScript', aliases: ['js'], category: 'languages', icon: 'js.webp', educationIds: ['dut'], conceptIds: ['programming', 'web'] },
  { id: 'html', name: 'HTML', category: 'languages', icon: 'html.webp', educationIds: ['dut'], conceptIds: ['web'] },
  { id: 'css', name: 'CSS', category: 'languages', icon: 'css.webp', educationIds: ['dut'], conceptIds: ['web'] },

  /** ▸ Librairies & frameworks */
  { id: 'react', name: 'React', category: 'libraries', icon: 'react.svg', experienceIds: ['ater-paris8'], conceptIds: ['web'] },
  { id: 'tensorflow', name: 'TensorFlow', aliases: ['tf'], category: 'libraries', icon: 'tensorflow.webp', educationIds: ['master'], conceptIds: ['computer-vision', 'anomaly-detection', 'machine-learning', 'deep-learning'] },
  { id: 'keras', name: 'Keras', category: 'libraries', icon: 'keras.webp', educationIds: ['master'], projectIds: ['kaggle-california-housing'], mediumPostIds: ['https://medium.com/p/89bd19ca464b', 'https://medium.com/p/f98104af68fe', 'https://medium.com/p/505cdf727735'], conceptIds: ['computer-vision', 'anomaly-detection', 'machine-learning', 'deep-learning'] },
  { id: 'sklearn', name: 'scikit-learn', aliases: ['sklearn', 'scikit'], category: 'libraries', icon: 'sklearn.webp', educationIds: ['master'], conceptIds: ['machine-learning', 'data-science'] },
  { id: 'pandas', name: 'Pandas', category: 'libraries', icon: 'pandas.svg', educationIds: ['master'], conceptIds: ['machine-learning', 'data-science'] },
  { id: 'numpy', name: 'NumPy', category: 'libraries', icon: 'numpy.svg', educationIds: ['master'], projectIds: ['kaggle-auto-mpg', 'kaggle-telco-churn'], conceptIds: ['machine-learning', 'data-science'] },
  { id: 'opencv', name: 'OpenCV', aliases: ['open cv'], category: 'libraries', icon: 'opencv.svg', educationIds: ['phd'], experienceIds: ['these-othello'], conceptIds: ['computer-vision', 'anomaly-detection', 'deep-learning'] },
  { id: 'nltk', name: 'NLTK', category: 'libraries', monogram: 'NLTK', educationIds: ['master'], conceptIds: ['nlp'] },
  { id: 'seaborn', name: 'Seaborn', category: 'libraries', icon: 'seaborn.svg', educationIds: ['master'], projectIds: ['kaggle-auto-mpg', 'kaggle-telco-churn'], conceptIds: ['data-science', 'visualization'] },
  { id: 'matplotlib', name: 'Matplotlib', category: 'libraries', icon: 'matplotlib.svg', educationIds: ['master'], projectIds: ['kaggle-auto-mpg', 'kaggle-telco-churn'], conceptIds: ['data-science', 'visualization'] },

  /** ▸ LLM & RAG */
  { id: 'langchain', name: 'LangChain', aliases: ['lang chain'], category: 'llm', icon: 'langchain.svg', experienceIds: ['ater-paris8'], conceptIds: ['nlp', 'llm', 'rag', 'embedding', 'vector-database'] },
  { id: 'huggingface', name: 'Hugging Face', aliases: ['huggingface', 'hf'], category: 'llm', icon: 'huggingface.svg', experienceIds: ['ater-paris8'], conceptIds: ['nlp', 'llm', 'rag', 'embedding'] },
  { id: 'ollama', name: 'Ollama', category: 'llm', icon: 'ollama.svg', experienceIds: ['ater-paris8'], conceptIds: ['llm', 'rag'] },
  { id: 'mistral', name: 'Mistral AI', aliases: ['mistral'], category: 'llm', icon: 'mistral.svg', experienceIds: ['freelance-leasup'], conceptIds: ['llm', 'rag'] },
  { id: 'gemini', name: 'Gemini', category: 'llm', icon: 'gemini.svg', experienceIds: ['freelance-leasup'], conceptIds: ['llm', 'rag'] },

  /** ▸ Bases de données & recherche */
  { id: 'sql', name: 'SQL', category: 'databases', icon: 'sql.webp', educationIds: ['dut'], conceptIds: ['databases'] },
  { id: 'mysql', name: 'MySQL', category: 'databases', icon: 'mysql.svg', educationIds: ['dut'], conceptIds: ['sql', 'databases'] },
  { id: 'postgresql', name: 'PostgreSQL', aliases: ['postgres'], category: 'databases', icon: 'postgresql.svg', educationIds: ['dut'], conceptIds: ['sql', 'databases'] },
  { id: 'chromadb', name: 'ChromaDB', aliases: ['chroma'], category: 'databases', icon: 'chromadb.svg', experienceIds: ['ater-paris8'], conceptIds: ['llm', 'rag', 'embedding', 'vector-database', 'databases'] },
  { id: 'elasticsearch', name: 'Elasticsearch', aliases: ['elastic search'], category: 'databases', icon: 'elasticsearch.svg', experienceIds: ['freelance-leasup'], conceptIds: ['vector-database', 'databases'] },

  /** ▸ Déploiement & MLOps */
  { id: 'docker', name: 'Docker', category: 'deployment', icon: 'docker.svg', experienceIds: ['ater-paris8'], conceptIds: ['mlops'] },
  { id: 'api-rest', name: 'API REST', aliases: ['rest api'], category: 'deployment', icon: 'api.svg', experienceIds: ['freelance-leasup'], conceptIds: ['mlops'] },
  { id: 'swagger', name: 'Swagger', category: 'deployment', icon: 'swagger.svg', experienceIds: ['ater-paris8'] },
  { id: 'flask', name: 'Flask', category: 'deployment', icon: 'flask.svg', experienceIds: ['ater-paris8'] },
  { id: 'mlflow', name: 'MLflow', category: 'deployment', icon: 'mlflow.svg', projectIds: ['kaggle-auto-mpg', 'kaggle-telco-churn'], conceptIds: ['mlops'] },

  /** ▸ Outils & méthodes */
  { id: 'git', name: 'Git', category: 'tools', icon: 'git.webp', experienceIds: ['ater-paris8'], conceptIds: ['software-engineering'] },
  { id: 'pytest', name: 'Pytest', category: 'tools', icon: 'pytest.svg', experienceIds: ['freelance-leasup'], conceptIds: ['software-engineering'] },
  { id: 'junit', name: 'JUnit', category: 'tools', icon: 'junit.svg', educationIds: ['dut'], conceptIds: ['java', 'software-engineering'] },
  { id: 'latex', name: 'LaTeX', category: 'tools', icon: 'latex.webp', educationIds: ['master'] },
  { id: 'uml', name: 'UML', category: 'tools', icon: 'uml.webp', educationIds: ['dut'], conceptIds: ['oop', 'java', 'software-engineering'] },
  { id: 'mvc', name: 'MVC', category: 'tools', monogram: 'MVC', educationIds: ['dut'], conceptIds: ['software-engineering'] },
  { id: 'poo', name: 'POO', aliases: ['oop'], category: 'tools', monogram: 'OOP', educationIds: ['dut'], conceptIds: ['oop', 'java', 'software-engineering'] },
  { id: 'jupyter', name: 'Jupyter', category: 'tools', icon: 'jupyter.webp', educationIds: ['master'], conceptIds: ['data-science'] },
];
