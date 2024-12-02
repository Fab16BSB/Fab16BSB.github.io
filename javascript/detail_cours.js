const COURSINFO = {

  french: {
    "Architecture des Ordinateurs": {
      support_cours: "Support fourni",
      TD:{
        "": ["Binaire", "Octale", "Hexa", "Complément à 1", "complément à 2", "Opération Binaire", "ASCII", "UTF-8"],
      },
    },

    "Architecture Logiciel": {
      support_cours: "Production du support",

      CM: {
        "Les bases de Python": [
          "Python2", "Python3", "Typage statique", "Typage dynamique", "Compiler", "Interpréter", "Typage faible", "Typage fort", "PEP 8", "PEP 257", "PEP 484", "snake_case",
          "Variables", "print", "input", "if", "else", "elif", "for i in range", "while", "match case", "cast", "caractère spéciaux", "ternaire", "assertion", "break", "continue",
          "pass", "compréhension list", "tuple", "list", "dict", "set", "string", "map", "zip", "lambda", "enumerate", "slice"
        ],
        "La POO en Python": [
          "méthode", "fonction", "procedure", "main", "paramètre", "paramètre optionnel", "passage par copie", "passage par référence", "return", "yield", "underscore", "generateur",
          "DocString", "Type Hints", "importations", "pip2", "pip3", "fichier", "erreur", "exception", "classe", "objet", "héritage", "polymorphisme", "self", "__str__", "__init__",
          "__eq__", "__hash__", "Surcharge d’opérateur", "méthode statique", "décorateur"
        ],
        "Flask / Archi logiciel (Fourni)": [
          "Application", "API", "Routes", "Endpoint"
        ],
      },
    },

    "Programmation Java": {
      support_cours: "Production du support",

      CM : {
        "Notions et termes" : [
          "Variables", "Methodes", "Fonctions", "Procédures", "Paramètres", "Passage par Copie", "Passage par Reference", "Passage par Valeur", "Passage par Adresse", 
          "Package", "Importation", "Classe", "Commentaire", "Compilation", "Exécution", "Domaine Application", "Avantage", "Caractéristiques", "Static", "Type", 
          "Portée",
        ],

        "Manipulation de données" : [
          "Float", "Int", "Double", "Long", "Char", "String", "Cast", "Incrementation", "Décrementation", "Binaire", "Operation", "Arithmetique",
          "Bibliothèque Math", "Fonction Mathématique", "Constante", "Stockage", "Affectation", "Initialisation", "Réaffectation", "Swap",
        ],

        "Saisie et affichage" : [
          "Input", "Output", "Affichage", "Message", "Erreur", "Couleur", "Saisie", "Délimiteur", "Entrée", "Sortie", "Formatage", "Scanner", "Print", 
          "Println", "Printf", "Format", "Caractère Spéciaux",
        ],

        "Les conditions" : ["Condition", "Opération", "Comparaison", "Connecteur", "Constructeur Logique", "If", "Else", "Menu", "Switch", "Ternaire", 
          "Assertion",
        ],

        "Les boucles" : ["Boucles", "For", "For Each", "While", "Do While", "Itérateur", "Pas", "Itération", "Break", "Continue", "Boucle Infinie",
        ],

        "Les collections" : ["Collection", "Tableau", "Liste", "Pile", "File", "Dico", "Hasmap", "Fifo", "Lifo", "Matrice", "Index", "Equals", 
          "String", "Pré POO",
        ],

        "Les erreurs et exceptions" : ["Try", "Catch", "Finally", "Throws", "Throw", "New Exception", "Erreur", "Exception", "Interruption",
          "Throwable", "Catch Multiple", "Catch All", "Checked Exception", "Unchecked Exception",
        ],

        "L'objet" : ["POO", "Objet", "Getter", "Setter", "ToString", "Constructeur", "Destructeur", "Garbage Collector", "Attribut", "Classes",
          "Méthode", "Méthode Statique", "Variable Statique",
        ],

        "Les differents types de structures" : ["POO", "Classe", "Classe Abstraite", "Interface", "Énumération", "Default Methode", "Record",
        ],

        "L'héritage" : ["POO", "Héritage", "Classe Final", "Méthode Final", "Super Type", "Classe Mère", "Classe Fille", "Extends", "Implements", "Problème du Diamant",
        ],

        "Le Polymorphisme" : ["POO", "Polymorphisme", "Surchage", "Type Générique", "Polymorphisme d'Hérritage", "Paramètre Optionel",
        ],
      }
    },

    "Programmation Orienté Objet en Java": {
      support_cours: "Production du support",
      CM : {
        "Introduction à la POO" : ["Programmation impérative", "Avantages de la POO", "Objet", "Héritage", "Polymorphisme", "Encapsulation", "Clases", 
          "Surchargement", "Surcharge", "Overloading", "Overriding", 
        ],

        "Introduction à l'UML" : [ "Diagramme de cas d'utilisation", "MCC", "MCD", "Use Case", "Diagramme de sequence", "Diagramme de classe", "Composition", "Agrégation", 
          "Cardinalité", "Acteur", "Système", "Inlcude", "Extend", "Classe d'association"
        ],

        "L'objet" : ["POO", "Objet", "Getter", "Setter", "ToString", "Constructeur", "Destructeur", "Garbage Collector", "Attribut", "Classes",
          "Méthode", "Méthode Statique", "Variable Statique",
        ],

        "L'héritage": ["POO", "Héritage", "Classe Final", "Méthode Final", "Super Type", "Classe Mère", "Classe Fille", "Extends", "Implements", "Problème du Diamant",
        ],

        "Le Polymorphisme": ["POO", "Polymorphisme", "Surchage", "Type Générique", "Polymorphisme D'Hérritage", "Paramètre Optionel"
        ],

        "La structure MVC": ["MVC","Model","Vue","Controler","Index","POO","Web"
        ],

        "Incluant des cours sur les bases du Java" : [],

        "Incluant un TD + un TP par cours": [],
        
      }
    },

    "Deep learning": {
      support_cours: "Production du support",
      CM : {
        "Introduction au Deep Learning": ["IA", "Machine Learning", "Deep Learning", "Réseaux de neurone", "Perceptron", "MLP",  "Régression", "Classification", 
          "Supevisé", "Non supervisé", "Semi supervisé", "Renforcement", "Prédiction", "Détection", "Overfiting", "Underfiting", "Gradient", "Descente gradient", 
          "Sigmoid", "Softmax", "Couches", "Biais", "Poids", "Batch", "Label", "Forward Propagation", "Back propagation", "Cost Function", "Epoch", "Learning curve",
          "Dropout", "Régularisation", "Accuracy", "Precision", "Rappel", "Spécificité", "F1-Score"  
        ],

        "La vision par ordinateur": ["Détection de contours", "histogramme de couleur", "CNN", "Convolution", "kernel", "Filtre", "Feature map", "Relu", "Pooling", 
          "Padding", "Flatten", "VGG", "Resnet", "Inception Resnet", "Classification", "Détection d'objet", "RCNN", "YOLO", "IoU", "Data Augmentation", "MAP", 
          "Vision Transformer", "Attention Map" 
        ],

        "Les séries temporelle": ["RNN", "LSTM", "GRU", "ConvRNN", "Convolutional RNN", "Convolution 3D", "Bidirectional LSTM"
        ],

        "Les données audio": ["Speaker Diarization", "Voice activity Detection", "Audio Denoising", "Speech Recognition", "Audio Classification", "Amplitude", "Période", 
          "Fréquence", "Phase", "Aliasing", "Echantillonage", "Quatification", "Digital Signal Processing", "Spectre fréquentiel", "Spectrogramme", "Densité spectrale", 
          "Périodigramme", "Enveloppe sonore", "Convolution 1D", "MLP", "RNN", "Data Augmentation", "TCN", "Speech to text"
        ],

        "Le text mining": ["Tokenization", "Vectorisation", "Stop word", "Lemmatisation", "Stemming", "Recherche Booléenne", "Recherche Vectorielle", "Recherche Probabiliste", 
          "IDF", "TF IDF", "Part of Speech", "N-Gramme", "One hot encoding", "Bag of word", "Word Embeddings", "Word2Vec", "CBOW", "Skip Gram", "GloVe", "Doc2Vec", 
          "Graph of word", "Transformer", "Bert", "GPT" 
        ],

        "L'apprentissage par renforcement": ["Renforcement", "État", "Agent", "Fonction d'action", "Recompense", "Fonction d'avantage", "Politique", "Fonction de valeur", 
          "Exploration", "Exploitation", "Epsilon-greedy", "Chaine de Markov", "Monte Carlo", "Temporal Difference", "Q-learning", "Deep Q-learning", "Policy Gradient", 
          "Actor-Critic", "Algorithmes Génétiques" 
        ],

        "La génération de données": ["Data augmentation", "Machine de Boltzmann", "Machine de Boltzmann Restreinte", "Deep Belief Network", "Auto-encodeurs", "GAN", 
          "DALL-E 2", "CLIP", "PRIOR", "GLIDE", "Stable Diffusion", "VALL-E"
          ],

        "Introduction à l'explicabilité": ["RGPD", "Explicabilité", "Interpretabilité", "Partial Dependence Plot", "SHAP", "LIME", "Grad Map", 
          "Filtre de Convolution", "Carte d'Activation", "Carte d'Attention", "Carte de Saillance", "Deep Dream" 
          ],

        "Incluant 3 TPs :" : ["Détection du diabètes", "Classification d'images", "Classification de commentaires"],
      }
    },

    "Programmation multimédia": {
      support_cours: "Production du support",
      CM: {
        "Introduction à la programmation multimédia": ["Multimédia", "Media", "Diffuseur", "Image", "Pixels", "RGB", "RGBA", "Canaux", "Format", "Définition", 
          "Résolution", "Colorimétrie", "CMJN", "Image Matricielle", "Image Vectorielle"
          ],

        "Introduction à la compression de données": ["Compression sans perte", "Compression avec perte", "LZW", "RLE", "Huffman"
        ],

        "Introduction à la stéganographie": ["Stéganographie", "Cryptographie", "Acrostiche", "Télestiche", "LSB", "Watermarking"
        ],

        "Introduction aux données vidéos": [ "Vidéo", "Image", "Son", "Amplitude", "Période", "Fréquence", "Phase", "Aliasing", "Sampling", "Quantification", "Monophonique", 
          "Stéréo", "5.1", "7.1", "format audio", "format vidéo", "FPS", "Ratio d'aspect", "Horodatage", "Métadonnées", "EXIF", "Codecs", "Bitrate"
        ],

        "Incluant un TP par cours": [],
      }
    },

    "Qualité d'algo": {
      support_cours: "Production du support",
      TP: {
        "TP1 : Qualité d'algo": ["Java", "Optimisation", "Refactoring", "Scalabilité", "Code review", "CheckStyle"],
        "TP2 : les algorithme de tris": ["Java vs Python", "Tableau vs Liste", "Tri par Sélection", "Tri par Insertion", "Tri à Bulle", "Vitesse exécution"],
        "TP3 : Optimisation des ressources": [ "Java vs C", "Thread", "Mutex", "Sémaphore", "visualVM", "Valgind"],
      }
    },

    "Système d'exploitation": {
      support_cours: "Support fourni",
     TD:{
        "TD1 : Manipulation de fichiers": ["Deplacement", "Listing", "Droits"],
        "TD2 : Droits et utilisateurs": ["Type de droits", "Mask"],
        "TD3 : Decoupe": ["Utilisation de l'instruction cut"],
        "TD4 : Chercher": ["Utilisation de l'instruction grep"],
        "TD5 : Scripts": ["Script", "Arguments", "Saisie"],
        "TD6 : Scripts : Structures de controle </br>": ["Condition", "Boucle"],
        "TD : sed" : ["Utilisation de la commande sed"]
     },
     TP : {
        "TP1 : Premieres commandes shell": ["Commande de base Unix", "ls", "cd", "touch", "mkdir", "Méta-caractères", "more", "head", "tail", "cat", "echo", "more", ">", ">>"],
        "TP2 : Liens et droits": ["chmod", "umask", "ln"],
        "TP3 : Processus et signaux": ["man", "wc", "cut", "ps", "kill", "Tube", "Pipe", "|"],
        "TP4 : Chercher et Trouver": ["find", "grep"],
        "TP5 : Premier script": ["Compréhension de Script", "Exécution", "Modification de Script"],
        "TP6 : Scripts Conditions et boucles": ["Élaboration de script", "Gestion des retours d'erreur"],
     }
    },

    "Développement Web": {
      support_cours: "Support fourni",
      TD:{
        "": ["HTML", "CSS", "Flexbox", "Grid", "Positionnement"],
      },
    },

    "Initiation au développement (Java)" : {
      support_cours: "Support fourni",
      TP : {
        "TP sur les conditions" : [],
        "TP sur les boucles" : [],
        "TP sur les tableaux" : [],
      }
    },

    "Intallation de Poste" : {
      Descriptif: {
        "2023-2024 </br> Encadrement d'une Situation d'Apprentissage et d'Évaluation (SAE) visant à guider les étudiants de première année de BUT dans l'installation d'un dual boot (Windows / Ubuntu) ainsi que dans l'acquisition des logiciels fondamentaux pour leur formation incluant les outils de développement, bases de données et les langages de programmation." : [],
        "2023-2025 </br> Encadrement d'une Situation d'Apprentissage et d'Évaluation (SAE) visant à guider les étudiants de première année de BUT dans l'installation d'une machine virtuel Ubuntu ainsi que dans l'acquisition des logiciels fondamentaux pour leur formation incluant les outils de développement, bases de données et les langages de programmation." : [],

        "Supervision de plusieurs soutenances, impliquant environ 90 étudiants répartis en groupes de 2 à 3." : [],
      }
    },

    "Cours de Soutien" : {
      support_cours: "Soutien Proposé",
      CM:{
        "Système d'exploitation (1)" :[],
        "Base de données (1)" : [],
        "Developpement Java (2)" : [],
      }
    },

    "PPP (Projet Professionnel et Personnel)": {
      support_cours: "",
      TD: {
        "Découverte de fiche métier" : [],
      },

      Descriptif: {
        "Événement de partage d’expérience professionnelle. <br>Je suis à l’initiative d’un projet destiné aux étudiants de première année. L’objectif principal de ce projet est de les mettre en contact avec des intervenants du milieu professionnel de l’informatique. Concrètement, le projet consiste à inviter des professionnels du secteur à organiser des présentations à distance. Chaque intervenant a l’occasion de se présenter, de partager son expérience professionnelle, de parler de son entreprise et des études qu’il a suivies. Les étudiants ont ensuite l’opportunité de poser des questions, ce qui favorise un échange direct et enrichissant. L’objectif global est de permettre aux étudiants de découvrir différentes branches de l’informatique, d’obtenir des conseils pratiques de la part de professionnels et ainsi mieux orienter leur parcours académique. Au total, une dizaine de participants issus de divers horizons professionnels sont envisagés pour prendre part à ces présentations. Parmi eux, des experts des domaines tels que le développement web, l'intelligence artificielle, le réseau, la programmation, la cybersécurité, etc." : [],
      }
    },

    "DOO (Developpement Orienté Objet)": {
      support_cours: "Support fourni",
      TP: {
        "TP de Java portant sur l'objet (Banque)" : [],
        "TP de Java portant sur l'objet + UML (Serveur mail) " : [],
      }
    },

    "prog BN": {
      support_cours: "Support fourni",
      TP: {
        "TP en C portant sur les structures" : [],
      }
    },

  },



  english: {
    "Java Programming" : {
        support_cours: "Production of the support",
      
        CM: {
          "Concepts and Terms": [
            "Variables", "Methods", "Functions", "Procedures", "Parameters", "Pass by Copy", "Pass by Reference", "Pass by Value", "Pass by Address",
            "Package", "Importation", "Class", "Comment", "Compilation", "Execution", "Application Domain", "Advantage", "Characteristics", "Static", "Type",
            "Scope",
          ],
      
          "Data Manipulation": [
            "Float", "Int", "Double", "Long", "Char", "String", "Cast", "Incrementation", "Decrementation", "Binary", "Operation", "Arithmetic",
            "Math Library", "Mathematical Function", "Constant", "Storage", "Assignment", "Initialization", "Reassignment", "Swap",
          ],
      
          "Input and Output": [
            "Input", "Output", "Display", "Message", "Error", "Color", "Input", "Delimiter", "Entry", "Output", "Formatting", "Scanner", "Print",
            "Println", "Printf", "Format", "Special Characters",
          ],
      
          "Conditions": [
            "Condition", "Operation", "Comparison", "Connector", "Logical Operator", "If", "Else", "Menu", "Switch", "Ternary",
            "Assertion",
          ],
      
          "Loops": [
            "Loops", "For", "For Each", "While", "Do While", "Iterator", "Step", "Iteration", "Break", "Continue", "Infinite Loop",
          ],
      
          "Collections": [
            "Collection", "Array", "List", "Stack", "Queue", "Dictionary", "HashMap", "Fifo", "Lifo", "Matrix", "Index", "Equals",
            "String", "Pre-OOP",
          ],
      
          "Errors and Exceptions": [
            "Try", "Catch", "Finally", "Throws", "Throw", "New Exception", "Error", "Exception", "Interruption",
            "Throwable", "Catch Multiple", "Catch All", "Checked Exception", "Unchecked Exception",
          ],
      
          "Object": [
            "OOP", "Object", "Getter", "Setter", "ToString", "Constructor", "Destructor", "Garbage Collector", "Attribute", "Classes",
            "Method", "Static Method", "Static Variable",
          ],
      
          "Different Types of Structures": [
            "OOP", "Class", "Abstract Class", "Interface", "Enumeration", "Default Method", "Record",
          ],
      
          "Inheritance": [
            "OOP", "Inheritance", "Final Class", "Final Method", "Super Type", "Parent Class", "Child Class", "Extends", "Implements", "Diamond Problem",
          ],
      
          "Polymorphism": [
            "OOP", "Polymorphism", "Overloading", "Generic Type", "Inheritance Polymorphism", "Optional Parameter",
          ],
        },
      },

    "Oriented Object Programming in Java": {
      support_cours: "Production of the support",

      CM: {
        "Introduction to OOP": [
          "Imperative Programming", "Advantages of OOP", "Object", "Inheritance", "Polymorphism", "Encapsulation", "Classes",
          "Overloading", "Overriding"
        ],
    
        "Introduction to UML": [
          "Use Case Diagram", "MCC", "MCD", "Use Case", "Sequence Diagram", "Class Diagram", "Composition", "Aggregation",
          "Cardinality", "Actor", "System", "Include", "Extend", "Association Class"
        ],
    
        "Object": [
          "OOP", "Object", "Getter", "Setter", "ToString", "Constructor", "Destructor", "Garbage Collector", "Attribute", "Classes",
          "Method", "Static Method", "Static Variable"
        ],
    
        "Inheritance": [
          "OOP", "Inheritance", "Final Class", "Final Method", "Super Type", "Parent Class", "Child Class", "Extends", "Implements", "Diamond Problem"
        ],
    
        "Polymorphism": [
          "OOP", "Polymorphism", "Overloading", "Generic Type", "Inheritance Polymorphism", "Optional Parameter"
        ],
    
        "MVC Structure": [
          "MVC", "Model", "View", "Controller", "Index", "OOP", "Web"
        ],
    
        "Including Courses on the Basics of Java": [],
    
        "Including a Directed Work + Practical Work for Each Course": []
      },
    },

    "Deep learning": {
      support_cours: "Production of the support",
      CM: {
        "Introduction to Deep Learning": [
          "AI", "Machine Learning", "Deep Learning", "Neural Networks", "Perceptron", "MLP", "Regression", "Classification",
          "Supervised", "Unsupervised", "Semi-supervised", "Reinforcement", "Prediction", "Detection", "Overfitting", "Underfitting", "Gradient", "Gradient Descent",
          "Sigmoid", "Softmax", "Layers", "Bias", "Weights", "Batch", "Label", "Forward Propagation", "Back Propagation", "Cost Function", "Epoch", "Learning Curve",
          "Dropout", "Regularization", "Accuracy", "Precision", "Recall", "Specificity", "F1-Score"
        ],
  
        "Computer Vision": [
          "Edge Detection", "Color Histogram", "CNN", "Convolution", "Kernel", "Filter", "Feature Map", "ReLU", "Pooling",
          "Padding", "Flatten", "VGG", "ResNet", "Inception ResNet", "Classification", "Object Detection", "RCNN", "YOLO", "IoU", "Data Augmentation", "MAP",
          "Vision Transformer", "Attention Map"
        ],
  
        "Time Series": [
          "RNN", "LSTM", "GRU", "ConvRNN", "Convolutional RNN", "3D Convolution", "Bidirectional LSTM"
        ],
  
        "Audio Data": [
          "Speaker Diarization", "Voice Activity Detection", "Audio Denoising", "Speech Recognition", "Audio Classification", "Amplitude", "Period",
          "Frequency", "Phase", "Aliasing", "Sampling", "Quantization", "Digital Signal Processing", "Frequency Spectrum", "Spectrogram", "Spectral Density",
          "Periodogram", "Sound Envelope", "1D Convolution", "MLP", "RNN", "Data Augmentation", "TCN", "Speech to Text"
        ],
  
        "Text Mining": [
          "Tokenization", "Vectorization", "Stop Word", "Lemmatization", "Stemming", "Boolean Retrieval", "Vector Retrieval", "Probabilistic Retrieval",
          "IDF", "TF IDF", "Part of Speech", "N-Gram", "One Hot Encoding", "Bag of Words", "Word Embeddings", "Word2Vec", "CBOW", "Skip Gram", "GloVe", "Doc2Vec",
          "Graph of Words", "Transformer", "Bert", "GPT"
        ],
  
        "Reinforcement Learning": [
          "Reinforcement", "State", "Agent", "Action Function", "Reward", "Advantage Function", "Policy", "Value Function",
          "Exploration", "Exploitation", "Epsilon-Greedy", "Markov Chain", "Monte Carlo", "Temporal Difference", "Q-learning", "Deep Q-learning", "Policy Gradient",
          "Actor-Critic", "Genetic Algorithms"
        ],
  
        "Data Generation": [
          "Data Augmentation", "Boltzmann Machine", "Restricted Boltzmann Machine", "Deep Belief Network", "Autoencoders", "GAN",
          "DALL-E 2", "CLIP", "PRIOR", "GLIDE", "Stable Diffusion", "VALL-E"
        ],
  
        "Introduction to Explainability": [
          "RGPD", "Explainability", "Interpretability", "Partial Dependence Plot", "SHAP", "LIME", "Grad Map",
          "Convolutional Filter", "Activation Map", "Attention Map", "Salience Map", "Deep Dream"
        ],
  
        "Including 3 Practical Works": ["Diabetes Detection", "Image Classification", "Comment Classification"]
      },
    },

    "Multimedia Programming": {
      support_cours: "Production of the support",

      CM: {
        "Introduction to Multimedia Programming": [
          "Multimedia", "Media", "Broadcaster", "Image", "Pixels", "RGB", "RGBA", "Channels", "Format", "Definition",
          "Resolution", "Colorimetry", "CMYB", "Raster Image", "Vector Image"
        ],
  
        "Introduction to Data Compression": [
          "Lossless Compression", "Lossy Compression", "LZW", "RLE", "Huffman"
        ],
  
        "Introduction to Steganography": [
          "Steganography", "Cryptography", "Acrostic", "Telestich", "LSB", "Watermarking"
        ],
  
        "Introduction to Video Data": [
          "Video", "Image", "Sound", "Amplitude", "Period", "Frequency", "Phase", "Aliasing", "Sampling", "Quantization", "Monophonic",
          "Stereophonic", "5.1", "7.1", "audio format", "video format", "FPS", "Aspect Ratio", "Timestamp", "Metadata", "EXIF", "Codecs", "Bitrate"
        ],
  
        "Including one practical exercise per course": []
      },
    },

    "Algorithm Quality": {
      support_cours: "Production of the support",

      TP: {
        "PW1: Algorithm Quality": ["Java", "Optimization", "Refactoring", "Scalability", "Code Review", "CheckStyle"],
        "PW2: Sorting Algorithms": ["Java vs Python", "Array vs List", "Selection Sort", "Insertion Sort", "Bubble Sort", "Execution Speed"],
        "PW3: Resource Optimization": ["Java vs C", "Thread", "Mutex", "Semaphore", "VisualVM", "Valgrind"]
      },
    },

    "Operating System": {
      support_cours: "Course material provided",

      TD: {
        "DW1: File Manipulation": ["Move", "Listing", "Permissions"],
        "DW2: Permissions and Users": ["Types of Permissions", "Mask"],
        "DW3: Cut": ["Learning utilisation of the cut command"],
        "DW4: Search": ["Learning utilisation of the grep command"],
        "DW5: Scripts": ["Script", "Arguments", "Input"],
        "DW6: Scripts: Control Structures": ["Condition", "Loop"]
      },

      TP: {
        "PW1: First Shell Commands": ["Basic Unix Command", "ls", "cd", "touch", "mkdir", "Meta-characters", "more", "head", "tail", "cat", "echo", "more", ">", ">>"],
        "PW2: Links and Permissions": ["chmod", "umask", "ln"],
        "PW3: Processes and Signals": ["man", "wc", "cut", "ps", "kill", "Pipe", "|"],
        "PW4: Search and Find": ["find", "grep"],
        "PW5: First Script": ["Understanding Scripts", "Execution", "Script Modification"],
        "PW6: Scripts Conditions and Loops": ["Script Development", "Handling Error Returns"]
      },
    },

    "Introduction to Development (Java)": {
      support_cours: "Course material provided",

      TP: {
        "PW on Conditions": [],
        "PW on Loops": [],
        "PW on Arrays": []
      }
    },
  
    "Workstation Setup": {
      Descriptif: {
        "Supervision of a Learning and Evaluation Situation (SAE) aimed at guiding first-year BUT students in setting up a dual boot (Windows / Ubuntu) and acquiring essential software for their classes, including development tools, databases, and programming languages.": [],
        "Supervision of multiple defenses, involving approximately 45 students divided into groups of 2 to 3.": []
      }
    },
  
    "Support Classes": {
      support_cours: "Proposed Support",
      CM: {
        "Operating System (1)": [],
        "Database (1)": [],
        "Java Development (2)": []
      }
    },

    "PPP (Professional and Personal Project)": {
      support_cours: "",
      TD: {
        "Job Description Discovery" : [],
      },

      Descriptif: {
        "Event for sharing professional experience. <br> I am leading a project aimed at first-year students. The main objective of this project is to connect them with professionals in the field of computer science. Concretely, the project involves inviting professionals from the sector to organize remote presentations. Each speaker has the opportunity to introduce themselves, share their professional experience, talk about their company, and the studies they have pursued. Students then have the opportunity to ask questions, fostering direct and enriching exchange. The overall goal is to allow students to discover different branches of computer science, obtain practical advice from professionals, and thus better orient their academic path. In total, about ten participants from various professional backgrounds are expected to take part in these presentations. Among them, experts in areas such as web development, artificial intelligence, networking, programming, cybersecurity, etc." : [],
      }
    },

    "OOD (Object Oriented Development)": {
      support_cours: "Course material provided",
      TP: {
        "Workshop in Java based on object (Bank)": [],
        "Workshop in Java based on object + UML (Mail Server)": [],
      }
    },

    "prog BN": {
      support_cours: "Course material provided",
      TP: {
        "Workshop in C focusing on structures": [],      
      }
    },

  },




  spanish: {
      "Programación Java": {
        support_cours: "Material preparado para el curso",
        
        CM: {
          "Conceptos y Términos": [
            "Variables", "Métodos", "Funciones", "Procedimientos", "Parámetros", "Paso por Copia", "Paso por Referencia", "Paso por Valor", "Paso por Dirección",
            "Paquete", "Importación", "Clase", "Comentario", "Compilación", "Ejecución", "Dominio de Aplicación", "Ventaja", "Características", "Estático", "Tipo",
            "Ámbito"
          ],
      
          "Manipulación de Datos": [
            "Float", "Int", "Double", "Long", "Char", "String", "Casteo", "Incremento", "Decremento", "Binario", "Operación", "Aritmética",
            "Biblioteca Matemática", "Función Matemática", "Constante", "Almacenamiento", "Asignación", "Inicialización", "Reasignación", "Intercambio"
          ],
      
          "Entrada y Salida": [
            "Entrada", "Salida", "Visualización", "Mensaje", "Error", "Color", "Delimitador", "Formato", "Scanner", "Print",
            "Println", "Printf", "Formato", "Caracteres Especiales"
          ],
      
          "Condiciones": [
            "Condición", "Operación", "Comparación", "Conector", "Operador Lógico", "If", "Else", "Menú", "Switch", "Ternario",
            "Aserción"
          ],
      
          "Bucles": [
            "Bucles", "For", "For Each", "While", "Do While", "Iterador", "Paso", "Iteración", "RompeBreakr", "Continue", "Bucle Infinito"
          ],
      
          "Colecciones": [
            "Colección", "Array", "Lista", "Pila", "Cola", "Diccionario", "HashMap", "Fifo", "Lifo", "Matriz", "Índice", "Equals",
            "String"
          ],
      
          "Errores y Excepciones": [
            "Try", "Catch", "Finally", "Throws", "Throw", "New Excepción", "Error", "Excepción", "Interrupción",
            "Throwable", "Multi Catch", "Catch All", "Excepción Comprobada", "Excepción No Comprobada"
          ],
      
          "Objeto": [
            "POO", "Objeto", "Getter", "Setter", "ToString", "Constructor", "Destructor", "Recolector de Basura", "Atributo", "Clases",
            "Método", "Método Estático", "Variable Estática"
          ],
      
          "Diferentes Tipos de Estructuras": [
            "POO", "Clase", "Clase Abstracta", "Interfaz", "Enumeración", "Método por Defecto", "Registro"
          ],
      
          "Herencia": [
            "POO", "Herencia", "Clase Final", "Método Final", "Super Tipo", "Clase Madre", "Clase Hija", "Extends", "Implements", "Problema del Diamante"
          ],
      
          "Polimorfismo": [
            "POO", "Polimorfismo", "Sobrecarga", "Tipo Genérico", "Polimorfismo de Herencia", "Parámetro Opcional"
          ]
        },
      },

      "Programación Orientada a Objetos con Java": {
        support_cours: "Material preparado para el curso",

        CM: {
          "Introduction a la Programación Orientada a Objetos (POO)": [
            "Programación imperativa", "Ventajas de la POO", "Objeto", "Herencia", "Polimorfismo", "Encapsulación", "Clases",
            "Sobrecarga", "Overriding", "Sobrecarga de métodos", "Anulación"
          ],
    
          "Introducción a UML": [
            "Diagrama de casos de uso", "MCC", "MCD", "Use Case", "Diagrama de secuencia", "Diagrama de clases", "Composición", "Agregación",
            "Cardinalidad", "Actor", "Sistema", "Incluir", "Extender", "Clase de asociación"
          ],
    
          "El Objeto": [
            "POO", "Objeto", "Getter", "Setter", "ToString", "Constructor", "Destructor", "Recolector de basura", "Atributo", "Clases",
            "Método", "Método estático", "Variable estática"
          ],
    
          "La Herencia": [
            "POO", "Herencia", "Clase final", "Método final", "Super tipo", "Clase madre", "Clase hija", "Extends", "Implements", "Problema del diamante"
          ],
    
          "El Polimorfismo": [
            "POO", "Polimorfismo", "Sobrecarga", "Tipo genérico", "Polimorfismo de herencia", "Parámetro opcional"
          ],
    
          "La estructura MVC": [
            "MVC", "Modelo", "Vista", "Controlador", "Índice", "POO", "Web"
          ],
    
          "Incluyendo cursos sobre los fundamentos de Java": [],
    
          "Incluyendo una clase teórica y una práctica por curso": []
        },
      },
    

      "Deep learning": {
        support_cours: "Material preparado para el curso",

        CM: {
          "Introduction au Deep Learning": [
            "AI", "Machine Learning", "Deep Learning", "Neural Networks", "Perceptron", "MLP", "Regression", "Classification",
            "Supervised", "Unsupervised", "Semi-supervised", "Reinforcement", "Prediction", "Detection", "Overfitting", "Underfitting", "Gradient", "Gradient Descent",
            "Sigmoid", "Softmax", "Layers", "Bias", "Weights", "Batch", "Label", "Forward Propagation", "Back Propagation", "Cost Function", "Epoch", "Learning Curve",
            "Dropout", "Regularization", "Accuracy", "Precision", "Recall", "Specificity", "F1-Score"
          ],
    
          "La visión por computadora": [
            "Edge Detection", "Color Histogram", "CNN", "Convolution", "Kernel", "Filter", "Feature Map", "ReLU", "Pooling",
            "Padding", "Flatten", "VGG", "ResNet", "Inception ResNet", "Classification", "Object Detection", "RCNN", "YOLO", "IoU", "Data Augmentation", "MAP",
            "Vision Transformer", "Attention Map"
          ],
    
          "Las series temporales": [
            "RNN", "LSTM", "GRU", "ConvRNN", "Convolutional RNN", "3D Convolution", "Bidirectional LSTM"
          ],
    
          "El formato audio": [
            "Speaker Diarization", "Voice Activity Detection", "Audio Denoising", "Speech Recognition", "Audio Classification", "Amplitude", "Period",
            "Frequency", "Phase", "Aliasing", "Sampling", "Quantization", "Digital Signal Processing", "Frequency Spectrum", "Spectrogram", "Spectral Density",
            "Periodogram", "Sound Envelope", "1D Convolution", "MLP", "RNN", "Data Augmentation", "TCN", "Speech to Text"
          ],
    
          "La minería de texto": [
            "Tokenization", "Vectorization", "Stop Word", "Lemmatization", "Stemming", "Boolean Retrieval", "Vector Retrieval", "Probabilistic Retrieval",
            "IDF", "TF IDF", "Part of Speech", "N-Gram", "One Hot Encoding", "Bag of Words", "Word Embeddings", "Word2Vec", "CBOW", "Skip Gram", "GloVe", "Doc2Vec",
            "Graph of Words", "Transformer", "Bert", "GPT"
          ],
    
          "El aprendizaje por refuerzo": [
            "Reinforcement", "State", "Agent", "Action Function", "Reward", "Advantage Function", "Policy", "Value Function",
            "Exploration", "Exploitation", "Epsilon-Greedy", "Markov Chain", "Monte Carlo", "Temporal Difference", "Q-learning", "Deep Q-learning", "Policy Gradient",
            "Actor-Critic", "Genetic Algorithms"
          ],
    
          "La generación de datos": [
            "Data Augmentation", "Boltzmann Machine", "Restricted Boltzmann Machine", "Deep Belief Network", "Autoencoders", "GAN",
            "DALL-E 2", "CLIP", "PRIOR", "GLIDE", "Stable Diffusion", "VALL-E"
          ],
    
          "Introducción a la explicabilidad": [
            "RGPD", "Explainability", "Interpretability", "Partial Dependence Plot", "SHAP", "LIME", "Grad Map",
            "Convolutional Filter", "Activation Map", "Attention Map", "Salience Map", "Deep Dream"
          ],
    
          "Incluyendo 3 TPs": ["Detección de Diabetes", "Clasificación de Imágenes", "Clasificación de Comentarios"]
        },
      },

      "Programación Multimedia": {
        support_cours: "Material preparado para el curso",

        CM: {
          "Introducción a la programación multimedia": [
            "Multimedia", "Medios", "Transmisor", "Imagen", "Píxeles", "RGB", "RGBA", "Canales", "Formato", "Definición",
            "Resolución", "Colorimetría", "CMAN", "Imagen Matricial", "Imagen Vectorial"
          ],
    
          "Introducción a la compresión de datos": [
            "Compresión sin pérdida", "Compresión con pérdida", "LZW", "RLE", "Huffman"
          ],
    
          "Introducción a la esteganografía": [
            "Esteganografía", "Criptografía", "Acróstico", "Telestico", "LSB", "Watermarking"
          ],
    
          "Introducción al formato video": [
            "Video", "Imagen", "Sonido", "Amplitud", "Período", "Frecuencia", "Fase", "Aliasing", "Muestreo", "Cuantificación", "Monofónico",
            "Estereofónico", "5.1", "7.1", "Formato de audio", "Formato de video", "FPS", "Relación de Aspecto", "Marca de Tiempo", "Metadatos", "EXIF", "Codecs", "Bitrate"
          ],
    
          "Incluyendo un TP por curso": []
        },
      },

      "Calidad de Algoritmos": {
        support_cours: "Material preparado para el curso",

        TP: {
          "TP1: Calidad de Algoritmos": ["Java", "Optimización", "Refactorización", "Escalabilidad", "Revisión de Código", "CheckStyle"],
          "TP2: Algoritmos de Ordenamiento": ["Java vs Python", "Array vs List", "Ordenamiento por Selección", "Ordenamiento por Inserción", "Ordenamiento de Burbuja", "Velocidad de Ejecución"],
          "TP3: Optimización de Recursos": ["Java vs C", "Hilo", "Mutex", "Semáforo", "VisualVM", "Valgrind"]
        },
      },

      "Sistema Operativo": {
        support_cours: "Material de curso disponible",

        TD: {
          "TD1: Manipulación de archivos": ["Mover", "Listar", "Permisos"],
          "TD2: Permisos y usuarios": ["Tipos de permisos", "Máscara"],
          "TD3: Corte": ["Uso del comando cut"],
          "TD4: Búsqueda": ["Uso del comando grep"],
          "TD5: Scripts": ["Script", "Argumentos", "Entrada"],
          "TD6: Scripts: Estructuras de control": ["Condición", "Bucle"]
        },

        TP: {
          "TP1: Primeras órdenes de Shell": ["Comando básico de Unix", "ls", "cd", "touch", "mkdir", "Meta-caracteres", "more", "head", "tail", "cat", "echo", "more", ">", ">>"],
          "TP2: Enlaces y permisos": ["chmod", "umask", "ln"],
          "TP3: Procesos y señales": ["man", "wc", "cut", "ps", "kill", "Tubo", "Tubería", "|"],
          "TP4: Buscar y Encontrar": ["find", "grep"],
          "TP5: Primer script": ["Comprensión de Scripts", "Ejecución", "Modificación de Scripts"],
          "TP6: Scripts Condiciones y bucles": ["Desarrollo de scripts", "Manejo de devoluciones de error"]
        },
      },

      "Instalación de Estación de Trabajo": {
        Descriptif: {
          "Supervisión de una Situación de Aprendizaje y Evaluación (SAE) destinada a guiar a los estudiantes de primer año de BUT en la instalación de un arranque dual (Windows / Ubuntu) y la adquisición de software esencial para su formación, incluidas las herramientas de desarrollo, bases de datos y lenguajes de programación.": [],
          "Supervisión de varias defensas, involucrando aproximadamente a 45 estudiantes divididos en grupos de 2 a 3.": []
        },
      },

      "Introducción al Desarrollo (Java)": {
        support_cours: "Material de curso disponible",

        TP: {
          "TP sobre Condiciones": [],
          "TP sobre Bucles": [],
          "TP sobre Arreglos": []
        },
      },
    
      "Clases de Refuerzos": {
        support_cours: "Clase de refuerzo Realizada",

        CM: {
          "Sistema Operativo (1)": [],
          "Base de Datos (1)": [],
          "Desarrollo Java (2)": []
        },
      },

      "PPP (Proyecto Profesional y Personal)": {
        support_cours: "",
        TD: {
          "Descubrimiento de Descripción de Puesto" : [],
        },
  
        Descriptif: {
          "Evento para compartir experiencia profesional. <br> Estoy liderando un proyecto dirigido a estudiantes de primer año. El objetivo principal de este proyecto es conectarlos con profesionales del campo de la informática. Concretamente, el proyecto implica invitar a profesionales del sector a organizar presentaciones remotas. Cada ponente tiene la oportunidad de presentarse, compartir su experiencia profesional, hablar sobre su empresa y los estudios que han seguido. Los estudiantes luego tienen la oportunidad de hacer preguntas, fomentando un intercambio directo y enriquecedor. El objetivo general es permitir que los estudiantes descubran diferentes ramas de la informática, obtener consejos prácticos de profesionales y así orientar mejor su trayectoria académica. En total, se espera que alrededor de diez participantes de diversos ámbitos profesionales participen en estas presentaciones. Entre ellos, expertos en áreas como desarrollo web, inteligencia artificial, redes, programación, ciberseguridad, etc." : [],
        }
      },

      "DOO (Desarrollo Orientado a Objetos)": {
        support_cours: "Material de curso disponible",
        TP: {
          "TP Java sobre el concepto de objeto (Banco)": [],
          "TP Java sobre objetos + UML (Servidores Mail)": [],
        }
      },
  
      "prog BN": {
        support_cours: "Material de curso disponible",
        TP: {
          "TP C basado en estructuras": [],  
        }
      },
  },
};