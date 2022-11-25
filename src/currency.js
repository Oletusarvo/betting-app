class Currency{
    constructor(options){
        this.precision = options.precision || 2;
        this.name = options.name || 'Default';
        this.short_name = options.short_name || 'DEF';
        this.symbol = options.symbol || 'D';
    }

    getString(amount){
        return this.symbol + amount.toFixed(this.precision);
    }
}

export default Currency;