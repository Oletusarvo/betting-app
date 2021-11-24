function error(type, what){
    throw {type: type, what: what};
}

module.exports = error;