function getHash(length){
    let string = "abcdefghijklmnopqrstuvwxyz1234567890"
    let c = ''
    for(let i =0; i < length; i++){
        c+= string[Math.floor(Math.random()*string.length)]
    }
    return c
}

module.exports = getHash