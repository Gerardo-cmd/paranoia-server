// program to generate random 4 digit code

const generateCode = () => {
    // declare all characters
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < 4; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export default generateCode;