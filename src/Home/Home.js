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
                    
                    <h2>Ohjeet</h2><br/>
                    <ul>
                        <li>
                            <a>Vedot</a>
                        </li>
                        <li>
                            <a>Profiili</a>
                        </li>
                        <li>
                            <a>Seinä</a>
                        </li>
                        <li>
                            <a>Haku</a>
                        </li>
                    </ul>
                </div>
            </div>

            :

            <UserWall/>
    );
}

export default Home;