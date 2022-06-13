const footerTag = document.getElementById("footer");
footerTag.innerHTML = `
        <table class="reseaux">
          <thead>
            <tr>
              <th colspan="4" id="tabReseauFirst"> -- Mes Réseaux --  </th>
              <th colspan="3" id="tabReseauLast"> -- Ma Communauté -- </th>
            </tr>
          </thead>

            <tr>
              <td> <a href=""> <div style="height:100%;width:100%"> <img src="image/mail_icon.png" alt="mail"> </div> </a>  </td>

              <td> <a href="https://github.com/Fab16BSB" title="https://github.com/Fab16BSB"> <div style="height:100%;width:100%"> <img src="image/github_icon.png" alt="github"> </div> </a>  </td>

              <td> <a href="https://medium.com/@fab.16" title="https://medium.com/@fab.16"> <div style="height:100%;width:100%"> <img src="image/medium_icon.png" alt="medium"> </div> </a>  </td>

              <td> <a href="https://www.youtube.com/channel/UCHS2xgITwh7olsnznmq8o0A" title="https://www.youtube.com/channel/UCHS2xgITwh7olsnznmq8o0A"> <div style="height:100%;width:100%"> <img src="image/youtube_icon.png" alt="youtube">  </div> </a> </td>

              <td> <a href="https://discord.gg/pgEUk9xVKe" title="https://discord.gg/pgEUk9xVKe"> <div style="height:100%;width:100%"> <img src="image/discord_icon.png" alt="discord"> </div> </a> </td>

              <td> <a href="https://github.com/override-community" title="https://github.com/override-community"> <div style="height:100%;width:100%"> <img src="image/github_icon.png" alt="github"> </div> </a>  </td>

              <td> <a href="https://medium.com/@overridecommunuty" title="https://medium.com/@overridecommunuty"> <div style="height:100%;width:100%"> <img src="image/medium_icon.png" alt="medium"> </div> </a> </td>
            </tr>
        </table>

        <p> <img id="htmlIcon" src="Image/html5.png" alt="HTML5"/> <img id="cssIcon" src="Image/css3.png" alt="CSS3"/> <img id="javascriptIcon" src="Image/javascript.png" alt="javascript"/> <img id="w3cValidation" src="Image/w3c.gif" alt="W3C Validation"/> <br>
          Icônes provenant de <a href="www.flaticon.com" title="www.flaticon.com"> flaticon </a> <br>
          Dernière mise à jour le 12/06/2022 <br>
          Site créé le 02/06/2022 <br>
        </p>
`