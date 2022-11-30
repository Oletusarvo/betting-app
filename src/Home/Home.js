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
                        
                        Tervetuloa veikkaus-sovellukseen! Täällä voit luoda vetoja ja panostaa nopiksi kutsuttua virtuaalirahaa, sekä seurata muita käyttäjiä.
                        Jokaiselle uudelle tilille annetaan 100 noppaa käytettäväksi (Saattaa muuttua ilmoituksetta).
                        Kirjaudu sisään käyttäjänimellä ja salasanalla <strong>demo</strong> jos et toistaiseksi halua luoda tiliä (Vetoihin osallistuminen estetty).
                    </p>
                    <br/>
                    
                    <h2>Sovellus</h2>
                    <br/>
                    <p>
                        Sovelluksessa on kolme pääosiota: Seinä, Profiili ja Top-20 vedon lista.<br/>
                        <h3>Seinä</h3><br/>
                        Täältä näet ja osallistut seuraamiesi käyttäjien luomiin vetoihin.<br/><br/>
                        <h3>Profiili</h3>
                        Sisältää vain omat vetosi. Voit hallita niitä helposti täältä. Näet myös seuraajiesi, seurattujesi sekä luomiesi vetojen kokonaismäärän.<br/><br/>
                        <h3>Top-20 lista</h3>
                        Sisältää 20 suurimman potin omaavaa vetoa. Voit myös etsiä nimellä tiettyä vetoa joka ei välttämättä ole top 20 joukossa.
                    </p>
                    <br/>
                    <p>
                        Sovellus on tuotantovaiheessa ja saattaa sisältää vikoja. Jotkut osiot voivat myös näyttää kömpelöiltä, toistaiseksi.<br/>
                        Ilmoitukset eivät toimi vielä kunnolla, mutta ovat työn alla.<br/>
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