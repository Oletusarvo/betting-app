for(let i = 0; i < 100; ++i){
    const id = Math.round(Math.random() * 0xFFFF);
    const comp = new Date().getTime() & 0xFFFF;
    const res = id ^ comp;

    if(res <= 256) console.log(res.toString(16));
}

