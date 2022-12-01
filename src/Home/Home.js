import React, {useContext} from 'react';
import './Style.scss';
import AppContext from '../Contexts/AppContext.js';
import UserWall from '../UserWall/UserWall.js';

function Home(){

    const {user} = useContext(AppContext);

    return (
        
            user === null ?
        
            <div className="flex-column fill w-100 pad overflow-y-scroll overflow-x-hide gap-default" id="home-page">

                <div className="container glass bg-fade">
                    <h1>Veikkaus App</h1>
                    <br/>
                    <p>
                        <strong>Huomio! Tämä sovellus on tarkoitettu näytettäväksi mobiililaitteilla pystyasennossa.<br/><br/>
                        Emme kerää luottokorttitietoja tai muita henkilökohtaisia tietoja. Tilin luomiseen tarvitaan ainoastaan keksimäsi käyttäjänimi
                        ja salasana. <br/>Sovelluksella ei ole mitään tekemistä veikkaus-rahapeliyhtiön kanssa. <br/><br/>
                        </strong>
                        
                        Tervetuloa veikkaus-sovellukseen! Täällä voit luoda vetoja ja panostaa nopiksi kutsuttua virtuaalirahaa. Idea lähti kun kaverukset läpällä 
                        miettivät että miksei printata feikki-euroja ja lyödä niillä vetoa mistä milloinkin. Nopeasti se idea kehittyi tähän.<br/><br/>
                        Jokaiselle uudelle tilille annetaan 100 noppaa käytettäväksi (Saattaa muuttua ilmoituksetta).
                        Kirjaudu sisään käyttäjänimellä ja salasanalla <strong>demo</strong> jos et toistaiseksi halua luoda tiliä (Vetoihin osallistuminen estetty).
                    </p>
                    <br/>
                    
                    <h2>Vedot</h2>
                    <p>
                        Vedot toimivat suoraviivaisella periaatteella. Niille määritellään nimi, tyyppi, vähimmäispanos, sekä vaihtoehtoinen korotus-summa ja eräpäivä.
                        Luodut vedot voidaan joko sulkea tiettyyn tulokseen (vain eräpäivänä, jos sellainen on määritelty) tai jäädyttää, tarkoittaen että vetoon osallistuminen estetään sulkematta sitä. Toiminto on hyödyllinen esim.
                        jos vedolle on määritetty eräpäivä, mutta vedon tulos tulee selville aikaisemmin. Jäädytetyt vedot voidaan avata uudelleen koska tahansa.<br/><br/>
                    </p>
                    <h2>Sovellus</h2>
                    <br/>
                    <p>
                        Sovelluksessa on kolme pääosiota: Seinä, Profiili ja Kaikkien vetojen lista.<br/><br/>
                        <h3>Seinä</h3>
                        Täältä näet ja osallistut seuraamiesi käyttäjien luomiin vetoihin.<br/><br/>
                        <h3>Profiili</h3>
                        Sisältää vain omat vetosi. Voit hallita niitä helposti täältä. Näet myös seuraajiesi, seurattujesi sekä luomiesi vetojen kokonaismäärän.<br/><br/>
                        Sivun yläosassa on kaksi ikonia: plus- ja noppamerkki. Plus merkki on linkki uuden vedon luomiseen ja noppa taas linkki noppageneraattoriin,
                        jossa voit tuottaa uusia noppia tilillesi jos taskut pääsevät tyhjäksi. Noppien luomiseen kuitenkin menee paljon aikaa, joten ei kannata törsätä.<br/><br/>
                        
                        <h3>Vetolista</h3>
                        Sisältää kaikki vedot lajiteltuna isoimmasta potista pienimpään. Voit myös täältä hallita itse luomiasi vetoja tai etsiä nimellä tiettyä vetoa.
                    </p>
                    <br/>
                    <p>
                        Sovellus on tuotantovaiheessa ja saattaa sisältää vikoja.
                        -Jotkut osiot ovat kesken.<br/>
                        -Ilmoitukset eivät toimi vielä kunnolla.<br/>
                        Ole hyvä ja ilmoita löytämäsi viat, tai kirjoita kysymyksesi tai ehdotuksesi osoitteeseen <a href="mailto:nistikemisti@gmail.com"><i>nistikemisti@gmail.com.</i></a><br/><br/>
                        Hauskoja skabahetkiä!
                    </p>
                </div>
            </div>

            :

            <UserWall/>
    );
}

export default Home;