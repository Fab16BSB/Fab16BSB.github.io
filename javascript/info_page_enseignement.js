const TAB = [
  {
    french :[
      {
        legend: "<b>* CM </b> : Cours Magistraux / <b>TD </b>: Travaux Dirigé / <b>TP</b>: Travaux pratique / <b>SAE</b> : Situation d'Apprentissage Évalué / <b>CS</b> : Cours de Soutien",
        label: ["Années", "Thème", "Niveau", "Étudiants", "Lieux", "Volume", "Distribution *"],
        info: [
          {
            year:`<span>2024</span>
                  <span> - </span>
                  <span>2025</span>`,
            theme: "Architecture des Ordinateurs",
            lvl: "BUT 1",
            student: "[30 - 15]",
            place: "Présentiel",
            quantity: "10",
            distribution: "<div> TD (5) </br> TP (5) </div>"
          },
          {
            year:`<span>2024</span>
                  <span> - </span>
                  <span>2025</span>`,
            theme: "Développement Web",
            lvl: "BUT 1",
            student: "15",
            place: "Présentiel",
            quantity: "10",
            distribution: "<div> TP </div>"
          },
          {
            year:`<span>2023</span>
                  <span> - </span>
                  <span>2025</span>`,
            theme: "Initiation au développement (Java)",
            lvl: "BUT 1",
            student: "15",
            place: "Présentiel",
            quantity: "44h",
            distribution: "<div> TP </div>"
          },
          {
            year:`<span>2023</span>
                  <span> - </span>
                  <span>2025</span>`,
            theme: "Intallation de Poste",
            lvl: "BUT 1",
            student: "[30 - 45]",
            place: "Présentiel",
            quantity: "18h",
            distribution: "<div> SAE </div>"
          },
          {
            year:`<span>2023</span>
                <span> - </span>
                <span>2025</span>`,
            theme: "Système d'exploitation",
            lvl: "BUT 1",
            student: "[15 - 30]",
            place: "Présentiel",
            quantity: "75h",
            distribution: "<div> TD (28) </br> TP (46) </div>"
          },
          {
            year:`<span>2023</span>
                <span> - </span>
                <span>2025</span>`,
            theme: "Qualité d'algo",
            lvl: "BUT 3",
            student: "38",
            place: "Présentiel",
            quantity: "19.5h",
            distribution: "<div> TP </div>"
          },
          {
            year:`<span>2023</span>
                  <span> - </span>
                  <span>2025</span>`,
            theme: "Programmation multimédia",
            lvl: "BUT 3",
            student: "[38 - 18]",
            place: "Présentiel",
            quantity: "32h",
            distribution: "<div> CM (11) </br> TP (21) </div>"
          },
          {
            year:`<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "Cours de Soutien",
            lvl: "BUT 1",
            student: "&asymp; 10",
            place: "Présentiel",
            quantity: "6h",
            distribution: "<div> CS </div>"
          },
          {
            year:`<span>2023</span>
                  <span> - </span>
                  <span>2024</span>`,
            theme: "Architecture Logiciel",
            lvl: "BUT 1",
            student: "50",
            place: "Présentiel",
            quantity: "21.5",
            distribution: "<div> CM (6)</br>TP (15.5) </div>"
          },
          {
            year:`<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "Implémentation d’un besoin client",
            lvl: "BUT 1",
            student: "15",
            place: "Présentiel",
            quantity: "9h",
            distribution: "<div> SAE </div>"
          },
          {
            year:`<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "Comparaison d’approches algorithmiques",
            lvl: "BUT 1",
            student: "15",
            place: "Présentiel",
            quantity: "6h",
            distribution: "<div> SAE </div>"
          },
          {
            year:`<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "Développement d’une application + Qualité de développement",
            lvl: "BUT 1",
            student: "15",
            place: "Présentiel",
            quantity: "24h",
            distribution: "<div> SAE </div>"
          },
          {
            year:`<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "Programation bas niveau",
            lvl: "BUT 1",
            student: "&asymp; 30",
            place: "Présentiel",
            quantity: "6h",
            distribution: "<div> TP </div>"
          },
          {
            year:`<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "Développement d’applications avec IHM",
            lvl: "BUT 1",
            student: "15",
            place: "Présentiel",
            quantity: "14h",
            distribution: "<div> TP </div>"
          },
          {
            year:`<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "DOO (Developpement Orienté Objet)",
            lvl: "BUT 1",
            student: "&asymp; 30",
            place: "Présentiel",
            quantity: "7.5h",
            distribution: "<div> TP </div>"
          },
          {
            year:`<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "PPP (Projet Professionnel et Personnel)",
            lvl: "BUT 1",
            student: "&asymp; 30",
            place: "Présentiel",
            quantity: "3h",
            distribution: "<div> TD </div>"
          },
          {
            year:`<span>2022</span>
                <span> - </span>
                <span>2023</span>`,
            theme: "Deep learning",
            lvl: "Master 1",
            student: "&asymp; 30",
            place: "Présentiel",
            quantity: "30h",
            distribution: "<div> CM </div>"
          },
          {
            year:`<span>2020</span>
                <span> - </span>
                <span>2023</span>`,
            theme: "Programmation Orienté Objet en Java",
            lvl: "Licence 2",
            student: "&asymp; 30/ans",
            place: "À distance",
            quantity: "135h",
            distribution: "<div> TD </div>"
          },
          {
            year:`<span>2019</span>
                <span> - </span>
                <span>2020</span>`,
            theme: "Programmation Java",
            lvl: "Licence 2",
            student: "&asymp; 30",
            place: "Présentiel",
            quantity: "15h",
            distribution: "<div> CM </div>"
          },
        ]
      },
    ],

    english :[
      {
        legend: "<b>* LC</b>: Lecture Class / <b>DW</b>: Directed Work / <b>PW</b>: Practical Work / <b>LES</b>: Learning and Evaluation Situation / <b>SC</b>: Support Classes",
        label: ["Years", "Theme", "Level", "Students", "Place", "Volume", "Distribution *"],
        info: [
          {
            year: `<span>2024</span>
            <span> - </span>
            <span>2025</span>`,
            theme: "Computer Architecture",
            lvl: "BUT 1",
            student: "[30 - 15]",
            place: "On-site",
            quantity: "10",
            distribution: "<div> DW (5) </br> PW (5) </div>"
          },
          {
            year: `<span>2024</span>
            <span> - </span>
            <span>2025</span>`,
            theme: "Web Development",
            lvl: "BUT 1",
            student: "15",
            place: "On-site",
            quantity: "10",
            distribution: "<div> PW </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2025</span>`,
            theme: "Introduction to Development (Java)",
            lvl: "BUT 1",
            student: "15",
            place: "On-site",
            quantity: "44h",
            distribution: "<div> PW </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2025</span>`,
            theme: "Workstation Setup",
            lvl: "BUT 1",
            student: "[30 - 45]",
            place: "On-site",
            quantity: "18h",
            distribution: "<div> LES </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2025</span>`,
            theme: "Operating Systems",
            lvl: "BUT 1",
            student: "[15 - 30]",
            place: "On-site",
            quantity: "75h",
            distribution: "<div> DW (28) </br> PW (46) </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2025</span>`,
            theme: "Algorithm Quality",
            lvl: "BUT 3",
            student: "38",
            place: "On-site",
            quantity: "19.5h",
            distribution: "<div> PW </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2025</span>`,
            theme: "Multimedia Programming",
            lvl: "BUT 3",
            student: "[38 - 18]",
            place: "On-site",
            quantity: "32h",
            distribution: "<div> LC (11) </br> PW (21) </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "Support Classes",
            lvl: "BUT 1",
            student: "&asymp; 10",
            place: "On-site",
            quantity: "6h",
            distribution: "<div> SC </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "Software Architecture",
            lvl: "BUT 1",
            student: "50",
            place: "On-site",
            quantity: "21.5",
            distribution: "<div> LC (6)</br>PW (15.5) </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "Implementing Client Requirements",
            lvl: "BUT 1",
            student: "15",
            place: "On-site",
            quantity: "9h",
            distribution: "<div> LES </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "Comparison of Algorithmic Approaches",
            lvl: "BUT 1",
            student: "15",
            place: "On-site",
            quantity: "6h",
            distribution: "<div> LES </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "Application Development + Development Quality",
            lvl: "BUT 1",
            student: "15",
            place: "On-site",
            quantity: "24h",
            distribution: "<div> LES </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "Low-Level Programming",
            lvl: "BUT 1",
            student: "&asymp; 30",
            place: "On-site",
            quantity: "6h",
            distribution: "<div> PW </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "Application Development with GUI",
            lvl: "BUT 1",
            student: "15",
            place: "On-site",
            quantity: "14h",
            distribution: "<div> PW </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "OOP (Object-Oriented Programming)",
            lvl: "BUT 1",
            student: "&asymp; 30",
            place: "On-site",
            quantity: "7.5h",
            distribution: "<div> PW </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "PPP (Personal and Professional Project)",
            lvl: "BUT 1",
            student: "&asymp; 30",
            place: "On-site",
            quantity: "3h",
            distribution: "<div> WD </div>"
          },
          {
            year: `<span>2022</span>
            <span> - </span>
            <span>2023</span>`,
            theme: "Deep Learning",
            lvl: "Master 1",
            student: "&asymp; 30",
            place: "On-site",
            quantity: "30h",
            distribution: "<div> LC </div>"
          },
          {
            year: `<span>2020</span>
            <span> - </span>
            <span>2023</span>`,
            theme: "Object-Oriented Programming in Java",
            lvl: "Bachelor's 2nd year",
            student: "&asymp; 30/year",
            place: "Online",
            quantity: "135h",
            distribution: "<div> DW </div>"
          },
          {
            year: `<span>2019</span>
            <span> - </span>
            <span>2020</span>`,
            theme: "Java Programming",
            lvl: "Bachelor's 2nd year",
            student: "&asymp; 30",
            place: "On-site",
            quantity: "15h",
            distribution: "<div> LC </div>"
          },
        ]
      },
    ],

    spanish :[
      {
        legend: "<b>* CM</b>: Clase Magistral / <b>TD</b>: Trabajos Dirigidos / <b>TP</b>: Trabajos Prácticos / <b>SAE</b>: Situación de Aprendizaje Evaluada / <b>CR</b>: Curso de Refuerzo",
        label: ["Años", "Tema", "Nivel", "Estudiantes", "Lugar", "Volumen", "Distribución *"],
        info: [
          {
            year: `<span>2024</span>
            <span> - </span>
            <span>2025</span>`,
            theme: "Arquitectura de Ordenadores",
            lvl: "BUT 1",
            student: "[30 - 15]",
            place: "Presencial",
            quantity: "10",
            distribution: "<div> TD (5) </br> TP (5) </div>"
          },
          {
            year: `<span>2024</span>
            <span> - </span>
            <span>2025</span>`,
            theme: "Desarrollo Web",
            lvl: "BUT 1",
            student: "15",
            place: "Presencial",
            quantity: "10",
            distribution: "<div> TP </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2025</span>`,
            theme: "Introducción al desarrollo (Java)",
            lvl: "BUT 1",
            student: "15",
            place: "Presencial",
            quantity: "44h",
            distribution: "<div> TP </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2025</span>`,
            theme: "Instalación de Puestos",
            lvl: "BUT 1",
            student: "[30 - 45]",
            place: "Presencial",
            quantity: "18h",
            distribution: "<div> SAE </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2025</span>`,
            theme: "Sistemas Operativos",
            lvl: "BUT 1",
            student: "[15 - 30]",
            place: "Presencial",
            quantity: "75h",
            distribution: "<div> TD (28) </br> TP (46) </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2025</span>`,
            theme: "Calidad de Algoritmos",
            lvl: "BUT 3",
            student: "38",
            place: "Presencial",
            quantity: "19.5h",
            distribution: "<div> TP </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2025</span>`,
            theme: "Programación Multimedia",
            lvl: "BUT 3",
            student: "[38 - 18]",
            place: "Presencial",
            quantity: "32h",
            distribution: "<div> CM (11) </br> TP (21) </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "Clases de Apoyo",
            lvl: "BUT 1",
            student: "&asymp; 10",
            place: "Presencial",
            quantity: "6h",
            distribution: "<div> CR </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "Arquitectura de Software",
            lvl: "BUT 1",
            student: "50",
            place: "Presencial",
            quantity: "21.5",
            distribution: "<div> CM (6)</br>TP (15.5) </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "Implementación de un Requisito del Cliente",
            lvl: "BUT 1",
            student: "15",
            place: "Presencial",
            quantity: "9h",
            distribution: "<div> SAE </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "Comparación de Enfoques Algorítmicos",
            lvl: "BUT 1",
            student: "15",
            place: "Presencial",
            quantity: "6h",
            distribution: "<div> SAE </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "Desarrollo de una Aplicación + Calidad del Desarrollo",
            lvl: "BUT 1",
            student: "15",
            place: "Presencial",
            quantity: "24h",
            distribution: "<div> SAE </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "Programación de Bajo Nivel",
            lvl: "BUT 1",
            student: "&asymp; 30",
            place: "Presencial",
            quantity: "6h",
            distribution: "<div> TP </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "Desarrollo de Aplicaciones con IHM",
            lvl: "BUT 1",
            student: "15",
            place: "Presencial",
            quantity: "14h",
            distribution: "<div> TP </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "DOO (Desarrollo Orientado a Objetos)",
            lvl: "BUT 1",
            student: "&asymp; 30",
            place: "Presencial",
            quantity: "7.5h",
            distribution: "<div> TP </div>"
          },
          {
            year: `<span>2023</span>
            <span> - </span>
            <span>2024</span>`,
            theme: "PPP (Proyecto Personal y Profesional)",
            lvl: "BUT 1",
            student: "&asymp; 30",
            place: "Presencial",
            quantity: "3h",
            distribution: "<div> TD </div>"
          },
          {
            year: `<span>2022</span>
            <span> - </span>
            <span>2023</span>`,
            theme: "Deep Learning",
            lvl: "Master 1",
            student: "&asymp; 30",
            place: "Presencial",
            quantity: "30h",
            distribution: "<div> CM </div>"
          },
          {
            year: `<span>2020</span>
            <span> - </span>
            <span>2023</span>`,
            theme: "Programación Orientada a Objetos en Java",
            lvl: "Licenciatura 2",
            student: "&asymp; 30/año",
            place: "A distancia",
            quantity: "135h",
            distribution: "<div> TD </div>"
          },
          {
            year: `<span>2019</span>
            <span> - </span>
            <span>2020</span>`,
            theme: "Programación en Java",
            lvl: "Licenciatura 2",
            student: "&asymp; 30",
            place: "Presencial",
            quantity: "15h",
            distribution: "<div> CM </div>"
          },
        ]
      },
    ],
  }
]
