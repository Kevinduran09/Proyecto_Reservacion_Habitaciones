export interface typeRoom{
    id: number,
    tipoHabitacion:string,
    capacidad:number
}
export interface filterRoom{
    dateStart:string,
    dateEnd:string,
    typeRoom:string | null,
    minValue:number|null,
    maxValue:number|null
}
export interface room{
    id:number,
    disponibilidad:string,
    precioNoche:GLfloat,
    url:string,
    public_id:string,
    tipo_habitacion_id:number,
    tipo_habitacion:typeRoom
}