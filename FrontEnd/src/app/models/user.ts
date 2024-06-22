export class UserCreate{
    constructor(
        public nombre:string,
        public apellidos:string,
        public correo:string,
        public cedula:string,
        public image:File|null,
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
        public id: number,
        public cedula: string,
        public nombre: string,
        public apellidos: string,
        public correo: string,
        public nomUsuario: string,
        public contrasena: string,
        public rol_id:number
    ) { }
}

export class User{
    constructor(
        public id:number|null,
        public nombre:string,
        public apellidos:string,
        public correo:string,
        public cedula:string,
        public image:File|null,
        public url:string|null,
        public public_id: string|null,
        public nomUsuario:string,
        public contraseña:string,
        public rol_id:number|null
    ){}
}