class JSONutil{
    replacer(key, value) {
        if(value instanceof Map) {
            return {
                dataType: 'Map',
                value: [...value]
            };
        }
        else{
            return value;
        }

        
    }
    
    reviver(key, value) {
        if (typeof value === 'object' && value !== null && value.dataType === 'Map') {
            return new Map(value.value);
        }
        else{
            return value;
        }
       
    }
}

module.exports = JSONutil;
