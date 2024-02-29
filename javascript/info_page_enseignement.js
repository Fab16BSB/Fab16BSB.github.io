const TAB = [
  {
    french :[
      {
        legend: "<b>* CM </b> : Cours Magistraux / <b>TD </b>: Travaux Dirigé / <b>TP</b>: Travaux pratique / <b>SAE</b> : Situation d'Apprentissage Évalué / <b>CS</b> : Cours de Soutien",
        label: ["Années", "Thème", "Niveau", "Étudiants", "Lieux", "Volume", "Distribution *"],
        info: [
          {
            year:`<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "Cours de Soutien",
            lvl: "BUT 1",
            student: "&asymp; 10",
            place: "Présentiel",
            quantity: "6h",
            distribution: "CS "
          },
          {
            year:`<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "prog BN",
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
            year:`<span>2023</span>
                  <span> - </span>
                  <span>2024</span>`,
            theme: "Initiation au développement (Java)",
            lvl: "BUT 1",
            student: "15",
            place: "Présentiel",
            quantity: "20h",
            distribution: "TP"
          },
          {
            year:`<span>2023</span>
                  <span> - </span>
                  <span>2024</span>`,
            theme: "Intallation de Poste",
            lvl: "BUT 1",
            student: "[30 - 45]",
            place: "Présentiel",
            quantity: "6h",
            distribution: "SAE"
          },
          {
            year:`<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "Système d'exploitation",
            lvl: "BUT 1",
            student: "[15 - 30]",
            place: "Présentiel",
            quantity: "49.5h",
            distribution: "<div> TD (13.5) </br> TP (36) </div>"
          },
          {
            year:`<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "Qualité d'algo",
            lvl: "BUT 3",
            student: "38",
            place: "Présentiel",
            quantity: "9.5h",
            distribution: "TP"
          },
          {
            year:`<span>2023</span>
                  <span> - </span>
                  <span>2024</span>`,
            theme: "Programmation multimédia",
            lvl: "BUT 3",
            student: "38",
            place: "Présentiel",
            quantity: "17h",
            distribution: "CM (6) </br> TP (11)"
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
            distribution: "CM"
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
            distribution: "TD (50) </br> TD (50) </br> TD (35)"
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
            distribution: "CM"
          },
        ]
      },
    ],

    english :[
      {
        legend: "<b>* LC</b>: Lecture Class / <b>DW</b>: Directed Work / <b>PW</b>: Practical Work / <b>LES</b>: Learning and Evaluation Situation / <b>SC</b>: Support Classes",
        label: ["Years", "Theme", "Level", "Students", "Place", "Volume", "Distribution"],
        info: [
          {
            year: `<span>2023</span>
                    <span> - </span>
                    <span>2024</span>`,
            theme: "Support Classes",
            lvl: "BUT 1",
            student: "&asymp; 10",
            place: "On-site",
            quantity: "6h",
            distribution: "SC"
          },
          {
            year:`<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "prog BN",
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
            theme: "OOD (Object Oriented Development)",
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
            theme: "PPP (Professional and Personal Project)",
            lvl: "BUT 1",
            student: "&asymp; 30",
            place: "Présentiel",
            quantity: "3h",
            distribution: "<div> TD </div>"
          },
          {
            year: `<span>2023</span>
                  <span> - </span>
                  <span>2024</span>`,
            theme: "Introduction to Development (Java)",
            lvl: "BUT 1",
            student: "15",
            place: "On-site",
            quantity: "20h",
            distribution: "PW"
          },
          {
            year: `<span>2023</span>
                  <span> - </span>
                  <span>2024</span>`,
            theme: "Workstation Setup",
            lvl: "BUT 1",
            student: "[30 - 45]",
            place: "On-site",
            quantity: "6h",
            distribution: "LES"
          },
          {
            year: `<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "Operating System",
            lvl: "BUT 1",
            student: "[15 - 30]",
            place: "On-site",
            quantity: "49.5h",
            distribution: "DW (13.5) </br> PW (36)"
          },
          {
            year: `<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "Algorithm Quality",
            lvl: "BUT 3",
            student: "38",
            place: "On-site",
            quantity: "9.5h",
            distribution: "PW"
          },
          {
            year: `<span>2023</span>
                  <span> - </span>
                  <span>2024</span>`,
            theme: "Multimedia Programming",
            lvl: "BUT 3",
            student: "38",
            place: "On-site",
            quantity: "17h",
            distribution: "LC (6) </br> PW (11)"
          },
           {
            year:`<span>2022</span>
                  <span> - </span>
                  <span>2023</span>`,
            theme: "Deep learning",
            lvl: "Master 1",
            student: "&asymp;30",
            place: "On-site",
            quantity: "30h",
            distribution: "LC"
          },
          {
            year:`<span>2020</span>
                  <span> - </span>
                  <span>2023</span>`,
            theme: "Oriented Object Programming in Java",
            lvl: "Licence 2",
            student: "&asymp;30/years",
            place: "Distance",
            quantity: "135h",
            distribution: "DW (50) </br> DW (50) </br> DW (35)"
          },
          {
            year:`<span>2019</span>
                  <span> - </span>
                  <span>2020</span>`,
            theme: "Java Programming",
            lvl: "License 2",
            student: "&asymp;30",
            place: "On-site",
            quantity: "15h",
            distribution: "LC"
          },
        ]
      },
    ],

    spanish :[
      {
        legend: "<b>* CM</b>: Clase Magistral / <b>TD</b>: Trabajos Dirigidos / <b>TP</b>: Trabajos Prácticos / <b>SAE</b>: Situación de Aprendizaje Evaluada / <b>CR</b>: Curso de Refuerzo",
        label: ["Años", "Tema", "Nivel", "Estudiantes", "Lugar", "Volumen", "Distribución"],
        info: [
          {
            year: `<span>2023</span>
                    <span> - </span>
                    <span>2024</span>`,
            theme: "Clases de Refuerzos",
            lvl: "BUT 1",
            student: "&asymp; 10",
            place: "Presencial",
            quantity: "6h",
            distribution: "CR"
          },
          {
            year:`<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "prog BN",
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
            theme: "DOO (Desarrollo Orientado a Objetos)",
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
            theme: "PPP (Proyecto Profesional y Personal)",
            lvl: "BUT 1",
            student: "&asymp; 30",
            place: "Présentiel",
            quantity: "3h",
            distribution: "<div> TD </div>"
          },
          {
            year: `<span>2023</span>
                  <span> - </span>
                  <span>2024</span>`,
            theme: "Introducción al Desarrollo (Java)",
            lvl: "BUT 1",
            student: "15",
            place: "Presencial",
            quantity: "20h",
            distribution: "TP"
          },
          {
            year: `<span>2023</span>
                  <span> - </span>
                  <span>2024</span>`,
            theme: "Instalación de Estación de Trabajo",
            lvl: "BUT 1",
            student: "[30 - 45]",
            place: "Presencial",
            quantity: "6h",
            distribution: "SAE"
          },
          {
            year: `<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "Sistema Operativo",
            lvl: "BUT 1",
            student: "[15 - 30]",
            place: "Presencial",
            quantity: "49.5h",
            distribution: "TD (13.5) </br> TP (36)"
          },
          {
            year: `<span>2023</span>
                <span> - </span>
                <span>2024</span>`,
            theme: "Calidad de Algoritmos",
            lvl: "BUT 3",
            student: "38",
            place: "Presencial",
            quantity: "9.5h",
            distribution: "TP"
          },
          {
            year: `<span>2023</span>
                  <span> - </span>
                  <span>2024</span>`,
            theme: "Programación Multimedia",
            lvl: "BUT 3",
            student: "38",
            place: "Presencial",
            quantity: "17h",
            distribution: "CM (6) </br> TP (11)"
          },          
           {
            year: "2022-2023",
            theme: "Deep learning",
            lvl: "Master 1",
            student: "&asymp;30",
            place: "Presencial",
            quantity: "30h",
            distribution: "CM"
          },
           {
            year: "2020-2023",
            theme: "Programación Orientada a Objetos con Java",
            lvl: "Licencia 2",
            student: "&asymp;30/años",
            place: "A distancia",
            quantity: "135h",
            distribution: "TD (50) </br> TD (50) </br> TD (35)"
          },
          {
            year: "2019-2020",
            theme: "Programación Java",
            lvl: "Licencia 2",
            student: "&asymp;30",
            place: "Presencial",
            quantity: "15h",
            distribution: "CM"
          },
        ]
      },
    ],
  }
]
