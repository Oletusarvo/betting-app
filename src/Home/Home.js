import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import GameList  from '../GameList/GameList.js';
import './Style.scss';
import AppContext from '../Contexts/AppContext.js';
import langStrings from '../lang';

function Home(){

    const {user, lang} = useContext(AppContext);

    return (
        <>
        <div className="flex-column fill w-100 pad overflow-y-scroll overflow-x-hide gap-default" id="home-page">
            {
                user === null ? 
                <div className="container glass bg-fade">
                    <h1>Veikkaus App</h1>
                    <br/>
                    <p>
                        <strong>Huomio! Tämä sovellus on tarkoitettu näytettäväksi mobiililaitteilla pystyasennossa.<br/><br/>
                        Sovellus on tuotantovaiheessa, joten siinä saattaa ilmetä vikoja.<br/><br/>
                        Ole hyvä ja ilmoita löytämäsi viat, ehdotuksesi tai kysymyksesi osoitteeseen nistikemisti@gmail.com</strong><br/><br/>
                        
                        Tervetuloa veikkaus-sovellukseen! (Ei liity veikkaus-rahapeliyhtiöön) Täällä voit luoda vetoja ja panostaa nopiksi kutsuttua virtuaalirahaa.
                        Jokaiselle uudelle tilille annetaan 100 noppaa käytettäväksi (Saattaa muuttua ilmoituksetta).
                        Kirjaudu sisään käyttäjänimellä ja salasanalla <strong>demo</strong> jos et toistaiseksi halua luoda tiliä (Vetoihin osallistuminen estetty).
                    </p>
                    <br/>
                    <h2>Vedot</h2>
                    <br/>
                    <h3>Tyypit</h3>
                    <p>
                        Vetoja voidaan luoda kahdenlaisia:
                    </p>
                    <br/>
                    <p>
                        <strong>Boolean</strong> vedoilla on kaksi mahdollista lopputulosta: Kyllä tai Ei.<br/><br/>
                        <strong>Multi-Choice</strong> vedoilla lopputulos määräytyy käyttäjän itse luomasta ja määrittämästä listasta.<br/><br/>
                    </p>
                    <br/>

                    <h2>Sovellus</h2>
                    <p>
                        Sovelluksessa on neljä välilehteä:<br/><br/>
                        <h3>Koti</h3>
                        Tästä välilehdestä näet ja suljet omat vetosi. (Vaatii sisäänkirjautumisen).<br/><br/>
                        <h3>Vedot</h3>
                        Sisältää kaikkien käyttäjien luomat vedot. Voit kotisivun lisäksi sulkea omat vetosi myös täältä. Osallistu haluamaasi vetoon napauttamalla sen otsikkoa ja sitten auennutta yleisnäkymää.<br/><br/>
                        <h3>Uusi veto</h3>
                        Vetoideasi luodaan täältä.<br/><br/>
                        <h3>Noppageneraattori</h3>
                        Luo uusia noppia käytettäväksi kun taskut ovat tyhjät.<br/><br/>
                        
                    </p>
                    <br/>
                
                    <p>
                        
                    </p>
                </div>
                :
                <>  
                    <div id="home-account-content" className="fill flex-column">
                        <h2>{langStrings["my-bets-header"][lang]}</h2>
                        <GameList byUser={true}/>
                    </div>
                    
                    <Link to="/account/delete" id="del-link">{langStrings["delete-account-link"][lang]}</Link>
                    
                </>
            }
        </div>
        
        </>
    );
}

export default Home;