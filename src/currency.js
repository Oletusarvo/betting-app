class Currency{

    //Represents a quantity of a currency at its smallest units.

    constructor(amount, precision = 1){
        this.amount = amount;
        this.precision = precision;
    }

    setQuantity(amount){
        this.amount = amount;
    }
    
    getAsString(locale = 'en'){
        return this.get().toLocaleString(locale);
    }

    get(){
        return this.amount / this.precision;
    }
}

export default Currency;