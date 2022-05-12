# QuoteNote

## Oletukset

>#### Projekti on tehty reactilla, node.js:llä ja PostgreSQL:llä. Asenna siis nämä, jotta voit suorittaa sovelluksen omalla koneella. 
>##### [PostgreSQL installer](https://www.postgresql.org/download/)
>##### [Node.js:n asennus, jonka mukana tulee npm](https://nodejs.org/en/download/)

## Asennus
#

### 1. Lataa repo dev opsista "git clone [repon-osoite-devopsista]"
#

### 2. Aja uuteen tietokantaan db-kansion "testidata_heroku02.sql"-tiedosto. 
#

### 3. Sekä server että client kansiossa, aja komento 'npm ci', joka asentaa tarvittavat riippuvuudet
#

### 4. Server kansiossa, kopioi .env.example ja nimeä se .env
#

### 5. .env-tiedostoon, täydennä kohdat
>##### DATABASE_URL = [postgresql-tietokannan connetion url]
>##### APP_PORT = 3001
>##### ACCESS_TOKEN_SECRET = [mikä tahansa merkkijono]
>##### REGISTRATION_SECRET = [mikä tahansa merkkijono]
#

### 6. Ota sähköpostivarmistus pois (tai laita sopivan sähköpostin tiedot .env-tiedostoon): 
>#### server > controllers > userController.js **kommentoi rivi 57**
>#### server > models > userModel.js **muuta rivin 29 'false' --> 'true'**
#

### 7. Paikallinen ja Herokun tietokanta käyttävät eri konfiguraatioita
>#### server > models > index.js 
#### Kommentoi rivit 26 ja 27, ja poista rivin 30 kommentointi. Paikallinen tietokanta ei käytä SSL-yhteyttä, siksi muutos
#
### 8. Palveluiden käynnistäminen
#### Nyt käynnistä komentoriviltä sekä client-kansiossa että server-kansiossa palvelut komennolla "npm start". Selaimeen pitäisi aueta oikea välilehti automaattisesti. 
