const TAB = [
  {
    french: [
      {
        label: ["Années", "Événement", "État", "Titre", "Version Officielle", "Version Traduite"],
        info: [
          {
            year: "2023",
            event: "<a href=\"AIccsa.net/AICCSA2023/\"> Conférence AICCSA : ACS/IEEE International Conference on Computer Systems and Applications </a>",
            state: "Présenté en attente de publication",
            title: "Enhancing Anomaly Detection in Videos using a Combined YOLO and a VGG GRU Approach",
            oficial: `<p> À venir </p>`,
            translate: `<p> À venir </p>`
          },
          {
            year: "2023",
            event: "Soutenance de Thèse",
            state: "Soutenu en attente de publication",
            title: "Détection d'anomalies en temps réel dans un flux vidéo",
            oficial: `<a href="document/thèse_poirier_fabien.pdf" class="button"> 
                        <img src="image/article_icon.png" alt="Article Icon"> 
                        <span> Article </span> 
                      </a>`,
            translate: `<p> À venir </p>`
          },
          {
            year: "2022",
            event: "<a href=\"https://egc2022.univ-tours.fr\"> Conférence EGC : Conférence francophone sur l'Extraction et la Gestion des Connaissances </a>",
            state: "Publié",
            title: "Détection d'anomalies en temps réel dans un flux vidéo",
            oficial: `<a href="https://editions-rnti.fr/?inprocid=1002757" class="button"> 
                        <img src="image/article_icon.png" alt="Article Icon"> 
                        <span> Article </span> 
                      </a> 
                      <a href="#" class="button" onClick="copierReference(event,\`@article{RNTI/papers/1002757,
                      author    = {Fabien Poirier and Rakia Jaziri and Camille Srour and Gilles Bernard},
                      title     = {Détection d'anomalies en temps réel dans le flux vidéo},
                      journal = {Revue des Nouvelles Technologies de l'Information},
                      volume = {Extraction et Gestion des Connaissances, RNTI-E-38},
                      year      = {2022},
                      pages     = {437-444}
                      }\`)"> 
                        <img src="image/citation_icon.png" alt="Citation Icon"> 
                        <span> Cite Me </span> 
                        <div class="popover" id="popover"> Référence Copiée ! </div>
                      </a>
                      <a href="document/EGC2022_POSTER_POIRIER_FABIEN.pdf" class="button"> 
                        <img src="image/poster_icon.png" alt="Poster Icon"> 
                        <span> Poster </span> 
                      </a>
                      <a href="https://www.youtube.com/watch?v=EGHUEPMI4c8" class="button"> 
                        <img src="image/demo_icon.png" alt="Demo Icon"> 
                        <span> Demo </span> 
                      </a>`,
            translate: `<a href="https://medium.com/@fab.16/real-time-anomalies-detection-on-videos-d8b3a4ae9c9b" class="button"> 
                          <img src="image/article_icon.png" alt="Article Icon"> 
                          <span> Article </span> 
                        </a>
                        `
          },
        ]
      },
    ],

    english:[
      {
        label: ["Years", "Event", "State", "Tile", "Official Version", "Translate Version"],
        info: [
          {
            year: "2023",
            event: "<a href=\"AIccsa.net/AICCSA2023/\"> AICCSA Conference: ACS/IEEE International Conference on Computer Systems and Applications </a>",
            state: "Presented, pending publication",
            title: "Enhancing Anomaly Detection in Videos using a Combined YOLO and a VGG GRU Approach",
            oficial: "<p> Upcoming </p>",
            translate: "<p> Upcoming </p>"
          },
          {
            year: "2023",
            event: "Thesis Defense",
            state: "Defended, pending publication",
            title: "Détection d'anomalies en temps réel dans un flux vidéo",
            oficial: `<a href="document/thèse_poirier_fabien.pdf" class="button"> 
                      <img src="image/article_icon.png" alt="Article Icon"> 
                      <span> Article </span> 
                    </a>`,
            translate: `<p> Upcoming </p>`
          },
          {
            year: "2022",
            event: "<a href=\"https://egc2022.univ-tours.fr\">  EGC Conference : Conférence francophone sur l'Extraction et la Gestion des Connaissances </a>",
            state: "Published",
            title: "Détection d'anomalies en temps réel dans un flux vidéo",
            oficial: `<a href="https://editions-rnti.fr/?inprocid=1002757" class="button"> 
                      <img src="image/article_icon.png" alt="Article Icon"> 
                      <span> Article </span> 
                    </a> 
                    <a href="#" class="button" onClick="copierReference(event,\`@article{RNTI/papers/1002757,
                    author    = {Fabien Poirier and Rakia Jaziri and Camille Srour and Gilles Bernard},
                    title     = {Détection d'anomalies en temps réel dans le flux vidéo},
                    journal = {Revue des Nouvelles Technologies de l'Information},
                    volume = {Extraction et Gestion des Connaissances, RNTI-E-38},
                    year      = {2022},
                    pages     = {437-444}
                    }\`)"> 
                      <img src="image/citation_icon.png" alt="Citation Icon"> 
                      <span> Cite Me </span> 
                      <div class="popover" id="popover"> Reference Copied ! </div>
                    </a>
                    <a href="document/EGC2022_POSTER_POIRIER_FABIEN.pdf" class="button"> 
                      <img src="image/poster_icon.png" alt="Poster Icon"> 
                      <span> Poster </span> 
                    </a>
                    <a href="https://www.youtube.com/watch?v=EGHUEPMI4c8" class="button"> 
                      <img src="image/demo_icon.png" alt="Demo Icon"> 
                      <span> Demo </span> 
                    </a>`,
            translate: `<a href="https://medium.com/@fab.16/real-time-anomalies-detection-on-videos-d8b3a4ae9c9b" class="button"> 
                          <img src="image/article_icon.png" alt="Article Icon"> 
                          <span> Article </span> 
                        </a>`
          },
        ]
      },
    ],

    spanish: [
      {
        label: ["Años", "Eventos", "Estado", "Título", "Versión Oficial", "Versión Traducida"],
        info: [
          {
            year: "2023",
            event: "<a href=\"AIccsa.net/AICCSA2023/\"> Conferencia AICCSA: ACS/IEEE International Conference on Computer Systems and Applications </a>",
            state: "Presentado, pendiente de publicación",
            title: "Enhancing Anomaly Detection in Videos using a Combined YOLO and a VGG GRU Approach",
            oficial: "<p> Próximamente </p>",
            translate: "<p> Próximamente </p>"
          },
          {
            year: "2023",
            event: "Defensa de Tesis",
            state: "Defendido, pendiente de publicación",
            title: "Détection d'anomalies en temps réel dans un flux vidéo",
            oficial: `<a href="document/thèse_poirier_fabien.pdf" class="button"> 
                        <img src="image/article_icon.png" alt="Article Icon"> 
                        <span> Article </span> 
                    </a>`,
            translate: "<p> Próximamente </p>"
          },
          {
            year: "2022",
            event: "<a href=\"https://egc2022.univ-tours.fr\"> Conferencia EGC : Conférence francophone sur l'Extraction et la Gestion des Connaissances </a>",
            state: "Publicado",
            title: "Détection d'anomalies en temps réel dans un flux vidéo",
            oficial: `<a href="https://editions-rnti.fr/?inprocid=1002757" class="button"> 
                      <img src="image/article_icon.png" alt="Article Icon"> 
                      <span> Article </span> 
                    </a> 
                    <a href="#" class="button" onClick="copierReference(event,\`@article{RNTI/papers/1002757,
                    author    = {Fabien Poirier and Rakia Jaziri and Camille Srour and Gilles Bernard},
                    title     = {Détection d'anomalies en temps réel dans le flux vidéo},
                    journal = {Revue des Nouvelles Technologies de l'Information},
                    volume = {Extraction et Gestion des Connaissances, RNTI-E-38},
                    year      = {2022},
                    pages     = {437-444}
                    }\`)"> 
                      <img src="image/citation_icon.png" alt="Citation Icon"> 
                      <span> Cite Me </span> 
                      <div class="popover" id="popover"> ¡Referencia Copiada! </div>
                    </a>
                    <a href="document/EGC2022_POSTER_POIRIER_FABIEN.pdf" class="button"> 
                      <img src="image/poster_icon.png" alt="Poster Icon"> 
                      <span> Poster </span> 
                    </a>
                    <a href="https://www.youtube.com/watch?v=EGHUEPMI4c8" class="button"> 
                      <img src="image/demo_icon.png" alt="Demo Icon"> 
                      <span> Demo </span> 
                    </a>`,
            translate: "<p> Próximamente </p>"
          },
        ]
      },
    ],
  }
]
