const TAB = [
  {
    french: [
      {
        label: ["Années", "Événement", "État", "Titre", "Version Officielle", "Version Traduite"],
        info: [
          {
            year: "2023",
            event: "<a href=\"AIccsa.net/AICCSA2023/\"> Conférence AICCSA : ACS/IEEE International Conference on Computer Systems and Applications </a>",
            state: "Publié",
            title: "Enhancing Anomaly Detection in Videos using a Combined YOLO and a VGG GRU Approach",
            oficial: `<a href="https://ieeexplore.ieee.org/abstract/document/10479307" class="button"> 
                        <img src="Image/article_icon.png" alt="Article Icon"> 
                        <span> Article </span> 
                      </a>
                      <!-- Cite me buttom -->
                      <a href="#" class="button" onClick="copierReference(event,\`@INPROCEEDINGS{10479307,
                        author={Poirier, Fabien and Jaziri, Rakia and Srour, Camille and Bernard, Gilles},
                        booktitle={2023 20th ACS/IEEE International Conference on Computer Systems and Applications (AICCSA)}, 
                        title={Enhancing Anomaly Detection in Videos using a Combined YOLO and a VGG GRU Approach}, 
                        year={2023},
                        volume={},
                        number={},
                        pages={1-6},
                        keywords={YOLO;Analytical models;Visualization;Video sequences;Computer architecture;Data models;Task analysis;Videos;Anomaly detection;YOLOv7;VGG19;GRU;Temporal Analysis},
                        doi={10.1109/AICCSA59173.2023.10479307}}, 
                      }\`)"> 
                        <img src="Image/citation_icon.png" alt="Citation Icon"> 
                        <span> Cite Me </span> 
                        <div class="popover" id="popover"> Référence Copiée ! </div>
                      </a>`,
            translate: `<p> </p>`
          },
          {
            year: "2023",
            event: "Soutenance de Thèse",
            state: "Publié",
            title: "Détection d'anomalies en temps réel dans un flux vidéo",
            oficial: `<a href="document/these_poirier_fabien.pdf" class="button"> 
                        <img src="Image/article_icon.png" alt="Article Icon"> 
                        <span> Article </span> 
                      </a>
                      <!-- Cite me buttom -->
                      <a href="#" class="button" onClick="copierReference(event,\`@phdthesis{poirier:tel-04792952,
                        TITLE = {{D{\\'e}tection d'anomalies en temps r{\\'e}el dans un flux vid{\\'e}o}},
                        AUTHOR = {Poirier, Fabien},
                        URL = {https://hal.science/tel-04792952},
                        NUMBER = {2023PA080032},
                        SCHOOL = {{Universit{\\'e} paris 8}},
                        YEAR = {2023},
                        MONTH = Sep,
                        KEYWORDS = {Neural networks ; Recurrent networks ; Convolutional networks ; Deep learning ; 
                        Object detection ; Action recognition ; Real-time ; Anomaly detection ; D{\\'e}tection d'anomalies ; R{\\'e}seaux de neurones ; 
                        R{\\'e}seaux r{\\'e}currents ; R{\\'e}seaux {\\'a} convolution ; Deep learning ; D{\\'e}tection d'objets; Reconnaissance d'actions ; 
                        Vid{\\'e}o temps r{\\'e}el},
                        TYPE = {Theses},
                        PDF = {
                          https://hal.science/tel-04792952v1/file/2023PA080032_POIRIER_Det.pdf},
                              HAL_ID = {tel-04792952},
                          HAL_VERSION = {v1},
                      }\`)"> 
                        <img src="Image/citation_icon.png" alt="Citation Icon"> 
                        <span> Cite Me </span> 
                        <div class="popover" id="popover"> Référence Copiée ! </div>
                      </a>`,

            translate: `<a href="https://arxiv.org/pdf/2411.19731" class="button"> 
                        <img src="Image/article_icon.png" alt="Article Icon"> 
                        <span> Article </span> 
                      </a>
                      <!-- Cite me buttom -->
                      <a href="#" class="button" onClick="copierReference(event,\`@misc{poirier2024realtimeanomalydetectionvideo,
                        title={Real-Time Anomaly Detection in Video Streams}, 
                        author={Fabien Poirier},
                        year={2024},
                        eprint={2411.19731},
                        archivePrefix={arXiv},
                        primaryClass={cs.CV},
                        url={https://arxiv.org/abs/2411.19731}, 
                      }\`)"> 
                        <img src="Image/citation_icon.png" alt="Citation Icon"> 
                        <span> Cite Me </span> 
                        <div class="popover" id="popover"> Référence Copiée ! </div>
                      </a>`
          },
          {
            year: "2022",
            event: "<a href=\"https://egc2022.univ-tours.fr\"> Conférence EGC : Conférence francophone sur l'Extraction et la Gestion des Connaissances </a>",
            state: "Publié",
            title: "Détection d'anomalies en temps réel dans le flux vidéo",
            oficial: `<a href="https://editions-rnti.fr/?inprocid=1002757" class="button"> 
                        <img src="Image/article_icon.png" alt="Article Icon"> 
                        <span> Article </span> 
                      </a> 
                      <!-- Cite me buttom -->
                      <a href="#" class="button" onClick="copierReference(event,\`@article{RNTI/papers/1002757,
                        author    = {Fabien Poirier and Rakia Jaziri and Camille Srour and Gilles Bernard},
                        title     = {Détection d'anomalies en temps réel dans le flux vidéo},
                        journal = {Revue des Nouvelles Technologies de l'Information},
                        volume = {Extraction et Gestion des Connaissances, RNTI-E-38},
                        year      = {2022},
                        pages     = {437-444}
                      }\`)"> 
                        <img src="Image/citation_icon.png" alt="Citation Icon"> 
                        <span> Cite Me </span> 
                        <div class="popover" id="popover"> Référence Copiée ! </div>
                      </a>
                      <!-- Poster buttom -->
                      <a href="document/EGC2022_POSTER_POIRIER_FABIEN.pdf" class="button"> 
                        <img src="Image/poster_icon.png" alt="Poster Icon"> 
                        <span> Poster </span> 
                      </a>
                      <!-- Demo Buttom -->
                      <a href="https://www.youtube.com/watch?v=EGHUEPMI4c8" class="button"> 
                        <img src="Image/demo_icon.png" alt="Demo Icon"> 
                        <span> Demo </span> 
                      </a>`,
            translate: `<a href="https://arxiv.org/pdf/2410.18051" class="button"> 
                          <img src="Image/article_icon.png" alt="Article Icon"> 
                          <span> Article </span> 
                        </a>
                         <!-- Cite me buttom -->
                         <a href="#" class="button" onClick="copierReference(event,\`@misc{poirier2024realtimeanomaliesdetection,
                              title={Real time anomalies detection on video}, 
                              author={Fabien Poirier},
                              year={2024},
                              eprint={2410.18051},
                              archivePrefix={arXiv},
                              primaryClass={cs.CV},
                              url={https://arxiv.org/abs/2410.18051}, 
                        }\`)"> 
                        <img src="Image/citation_icon.png" alt="Citation Icon"> 
                        <span> Cite Me </span> 
                        <div class="popover" id="popover"> Référence Copiée ! </div>
                      </a>`
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
            state: "Published",
            title: "Enhancing Anomaly Detection in Videos using a Combined YOLO and a VGG GRU Approach",
            oficial: `<a href="https://ieeexplore.ieee.org/abstract/document/10479307" class="button"> 
                        <img src="Image/article_icon.png" alt="Article Icon"> 
                        <span> Article </span> 
                      </a>
                      <!-- Cite me buttom -->
                      <a href="#" class="button" onClick="copierReference(event,\`@INPROCEEDINGS{10479307,
                        author={Poirier, Fabien and Jaziri, Rakia and Srour, Camille and Bernard, Gilles},
                        booktitle={2023 20th ACS/IEEE International Conference on Computer Systems and Applications (AICCSA)}, 
                        title={Enhancing Anomaly Detection in Videos using a Combined YOLO and a VGG GRU Approach}, 
                        year={2023},
                        volume={},
                        number={},
                        pages={1-6},
                        keywords={YOLO;Analytical models;Visualization;Video sequences;Computer architecture;Data models;Task analysis;Videos;Anomaly detection;YOLOv7;VGG19;GRU;Temporal Analysis},
                        doi={10.1109/AICCSA59173.2023.10479307}}, 
                      }\`)"> 
                        <img src="Image/citation_icon.png" alt="Citation Icon"> 
                        <span> Cite Me </span> 
                        <div class="popover" id="popover"> Référence Copiée ! </div>
                      </a>`,
            translate: `<p> </p>`
          },
          {
            year: "2023",
            event: "Thesis Defense",
            state: "Published",
            title: "Détection d'anomalies en temps réel dans un flux vidéo",
            oficial: `<a href="document/these_poirier_fabien.pdf" class="button"> 
                        <img src="Image/article_icon.png" alt="Article Icon"> 
                        <span> Article </span> 
                      </a>
                      <!-- Cite me buttom -->
                      <a href="#" class="button" onClick="copierReference(event,\`@phdthesis{poirier:tel-04792952,
                        TITLE = {{D{\\'e}tection d'anomalies en temps r{\\'e}el dans un flux vid{\\'e}o}},
                        AUTHOR = {Poirier, Fabien},
                        URL = {https://hal.science/tel-04792952},
                        NUMBER = {2023PA080032},
                        SCHOOL = {{Universit{\\'e} paris 8}},
                        YEAR = {2023},
                        MONTH = Sep,
                        KEYWORDS = {Neural networks ; Recurrent networks ; Convolutional networks ; Deep learning ; 
                        Object detection ; Action recognition ; Real-time ; Anomaly detection ; D{\\'e}tection d'anomalies ; R{\\'e}seaux de neurones ; 
                        R{\\'e}seaux r{\\'e}currents ; R{\\'e}seaux {\\'a} convolution ; Deep learning ; D{\\'e}tection d'objets; Reconnaissance d'actions ; 
                        Vid{\\'e}o temps r{\\'e}el},
                        TYPE = {Theses},
                        PDF = {
                          https://hal.science/tel-04792952v1/file/2023PA080032_POIRIER_Det.pdf},
                              HAL_ID = {tel-04792952},
                          HAL_VERSION = {v1},
                      }\`)"> 
                        <img src="Image/citation_icon.png" alt="Citation Icon"> 
                        <span> Cite Me </span> 
                        <div class="popover" id="popover"> Référence Copiée ! </div>
                      </a>`,

            translate: `<a href="https://arxiv.org/pdf/2411.19731" class="button"> 
                        <img src="Image/article_icon.png" alt="Article Icon"> 
                        <span> Article </span> 
                      </a>
                      <!-- Cite me buttom -->
                      <a href="#" class="button" onClick="copierReference(event,\`@misc{poirier2024realtimeanomalydetectionvideo,
                        title={Real-Time Anomaly Detection in Video Streams}, 
                        author={Fabien Poirier},
                        year={2024},
                        eprint={2411.19731},
                        archivePrefix={arXiv},
                        primaryClass={cs.CV},
                        url={https://arxiv.org/abs/2411.19731}, 
                      }\`)"> 
                        <img src="Image/citation_icon.png" alt="Citation Icon"> 
                        <span> Cite Me </span> 
                        <div class="popover" id="popover"> Référence Copiée ! </div>
                      </a>`
          },
          {
            year: "2022",
            event: "<a href=\"https://egc2022.univ-tours.fr\">  EGC Conference : Conférence francophone sur l'Extraction et la Gestion des Connaissances </a>",
            state: "Published",
            title: "Détection d'anomalies en temps réel dans le flux vidéo",
            oficial: `<a href="https://editions-rnti.fr/?inprocid=1002757" class="button"> 
                      <img src="Image/article_icon.png" alt="Article Icon"> 
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
                      <img src="Image/citation_icon.png" alt="Citation Icon"> 
                      <span> Cite Me </span> 
                      <div class="popover" id="popover"> Reference Copied ! </div>
                    </a>
                    <a href="document/EGC2022_POSTER_POIRIER_FABIEN.pdf" class="button"> 
                      <img src="Image/poster_icon.png" alt="Poster Icon"> 
                      <span> Poster </span> 
                    </a>
                    <a href="https://www.youtube.com/watch?v=EGHUEPMI4c8" class="button"> 
                      <img src="Image/demo_icon.png" alt="Demo Icon"> 
                      <span> Demo </span> 
                    </a>`,
            translate: `<a href="https://arxiv.org/pdf/2410.18051" class="button"> 
                          <img src="Image/article_icon.png" alt="Article Icon"> 
                          <span> Article </span> 
                        </a>
                         <!-- Cite me buttom -->
                         <a href="#" class="button" onClick="copierReference(event,\`@misc{poirier2024realtimeanomaliesdetection,
                              title={Real time anomalies detection on video}, 
                              author={Fabien Poirier},
                              year={2024},
                              eprint={2410.18051},
                              archivePrefix={arXiv},
                              primaryClass={cs.CV},
                              url={https://arxiv.org/abs/2410.18051}, 
                        }\`)"> 
                        <img src="Image/citation_icon.png" alt="Citation Icon"> 
                        <span> Cite Me </span> 
                        <div class="popover" id="popover"> Référence Copiée ! </div>
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
            state: "Publicado",
            title: "Enhancing Anomaly Detection in Videos using a Combined YOLO and a VGG GRU Approach",
            oficial: `<a href="https://ieeexplore.ieee.org/abstract/document/10479307" class="button"> 
                        <img src="Image/article_icon.png" alt="Article Icon"> 
                        <span> Article </span> 
                      </a>
                      <!-- Cite me buttom -->
                      <a href="#" class="button" onClick="copierReference(event,\`@INPROCEEDINGS{10479307,
                        author={Poirier, Fabien and Jaziri, Rakia and Srour, Camille and Bernard, Gilles},
                        booktitle={2023 20th ACS/IEEE International Conference on Computer Systems and Applications (AICCSA)}, 
                        title={Enhancing Anomaly Detection in Videos using a Combined YOLO and a VGG GRU Approach}, 
                        year={2023},
                        volume={},
                        number={},
                        pages={1-6},
                        keywords={YOLO;Analytical models;Visualization;Video sequences;Computer architecture;Data models;Task analysis;Videos;Anomaly detection;YOLOv7;VGG19;GRU;Temporal Analysis},
                        doi={10.1109/AICCSA59173.2023.10479307}}, 
                      }\`)"> 
                        <img src="Image/citation_icon.png" alt="Citation Icon"> 
                        <span> Cite Me </span> 
                        <div class="popover" id="popover"> Référence Copiée ! </div>
                      </a>`,
            translate: "<p> Próximamente </p>"
          },
          {
            year: "2023",
            event: "Defensa de Tesis",
            state: "Publicada",
            title: "Détection d'anomalies en temps réel dans un flux vidéo",
            oficial: `<a href="document/these_poirier_fabien.pdf" class="button"> 
                        <img src="Image/article_icon.png" alt="Article Icon"> 
                        <span> Article </span> 
                      </a>
                      <!-- Cite me buttom -->
                      <a href="#" class="button" onClick="copierReference(event,\`@phdthesis{poirier:tel-04792952,
                        TITLE = {{D{\\'e}tection d'anomalies en temps r{\\'e}el dans un flux vid{\\'e}o}},
                        AUTHOR = {Poirier, Fabien},
                        URL = {https://hal.science/tel-04792952},
                        NUMBER = {2023PA080032},
                        SCHOOL = {{Universit{\\'e} paris 8}},
                        YEAR = {2023},
                        MONTH = Sep,
                        KEYWORDS = {Neural networks ; Recurrent networks ; Convolutional networks ; Deep learning ; 
                        Object detection ; Action recognition ; Real-time ; Anomaly detection ; D{\\'e}tection d'anomalies ; R{\\'e}seaux de neurones ; 
                        R{\\'e}seaux r{\\'e}currents ; R{\\'e}seaux {\\'a} convolution ; Deep learning ; D{\\'e}tection d'objets; Reconnaissance d'actions ; 
                        Vid{\\'e}o temps r{\\'e}el},
                        TYPE = {Theses},
                        PDF = {
                          https://hal.science/tel-04792952v1/file/2023PA080032_POIRIER_Det.pdf},
                              HAL_ID = {tel-04792952},
                          HAL_VERSION = {v1},
                      }\`)"> 
                        <img src="Image/citation_icon.png" alt="Citation Icon"> 
                        <span> Cite Me </span> 
                        <div class="popover" id="popover"> Référence Copiée ! </div>
                      </a>`,
            translate: "<p> Próximamente </p>"
          },
          {
            year: "2022",
            event: "<a href=\"https://egc2022.univ-tours.fr\"> Conferencia EGC : Conférence francophone sur l'Extraction et la Gestion des Connaissances </a>",
            state: "Publicado",
            title: "Détection d'anomalies en temps réel dans le flux vidéo",
            oficial: `<a href="https://editions-rnti.fr/?inprocid=1002757" class="button"> 
                      <img src="Image/article_icon.png" alt="Article Icon"> 
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
                      <img src="Image/citation_icon.png" alt="Citation Icon"> 
                      <span> Cite Me </span> 
                      <div class="popover" id="popover"> ¡Referencia Copiada! </div>
                    </a>
                    <a href="document/EGC2022_POSTER_POIRIER_FABIEN.pdf" class="button"> 
                      <img src="Image/poster_icon.png" alt="Poster Icon"> 
                      <span> Poster </span> 
                    </a>
                    <a href="https://www.youtube.com/watch?v=EGHUEPMI4c8" class="button"> 
                      <img src="Image/demo_icon.png" alt="Demo Icon"> 
                      <span> Demo </span> 
                    </a>`,
            translate: "<p> Próximamente </p>"
          },
        ]
      },
    ],
  }
]
