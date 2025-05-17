export class FirebaseConfigService{
    constructor(public readonly apikey: string){
        if (!apikey) {
            throw new Error('API key is not defined');
        }
    }
}