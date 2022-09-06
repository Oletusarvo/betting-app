export function rollDice(token, setAnimateColor){
    const req = new XMLHttpRequest();
    req.open('POST', '/coins', true);
    req.setRequestHeader('auth', token);
    req.setRequestHeader('Content-Type', 'application/json');

    const n = parseInt(prompt('Guess the secret server number (max 256)'));
    if(n){
        const data = {
            guess : n
        };
        req.send(JSON.stringify(data));

        req.onload = () => {
            if(req.status === 200){
                const result = req.response;
                if(result > 0){
                    alert(`Congratulations! You guessed correctly and won $${req.response}`);
                    setAnimateColor('animate-green');
                }
                else{
                    alert('You guessed incorrectly! Better luck next time!');
                    setAnimateColor('animate-red');
                }
                
            }
            
        }
    }
    
   
}