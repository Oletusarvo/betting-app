function HomeNoLog(props){
    return (
        <div className="page" id="home-page">
            <div className="container glass bg-fade">
                    <h1>Veikkaus App</h1>
                    <br/>
                    <p>
                        <strong>Huomio! Tämä sovellus on tarkoitettu näytettäväksi mobiililaitteilla pystyasennossa.<br/><br/>
                        Emme kerää luottokorttitietoja tai muita henkilökohtaisia tietoja. Tilin luomiseen tarvitaan ainoastaan keksimäsi käyttäjänimi
                        ja salasana. <br/><br/>
                        </strong>
                        
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
        </div>
    )
}

export default HomeNoLog;