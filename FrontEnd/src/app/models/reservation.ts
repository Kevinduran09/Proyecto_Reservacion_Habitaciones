export class Reservation{
    constructor(
        public id:number|null,
        public fechaIngreso:string,
        public fechaSalida:string,
        public estado:string,
        public precioTotal:number|null,
        public usuario_id:number|null
    ){}
}