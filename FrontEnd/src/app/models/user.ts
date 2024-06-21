export class UserCreate{
    constructor(
        public nombre:string,
        public apellidos:string,
        public correo:string,
        public cedula:string,
        public nomUsuario:string,
        public contraseña:string
    ){}
}
export class UserLogin{
    constructor(
        public nomUsuario:string,
        public contraseña:string
    ){}
}
export class UserResponse{
    constructor(
        public cedula: string,
        public nombre: string,
        public apellidos: string,
        public correo: string,
        public nomUsuario: string,
        public contrasena: string,
        public rol_id:number
    ) { }
}