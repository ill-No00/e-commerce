


class Logger{

    constructor(){
        this.loggs = []
    }

    log(message){
        this.loggs.push({message : message})
        console.log(message)
    }
}



export default new Logger()