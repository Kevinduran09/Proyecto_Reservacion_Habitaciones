export class Service{
    constructor(
        public id:number|null,
        public nombre:string,
        public descripcion:string,
        public costo:number|null,
        public activo:string
    ){}
}