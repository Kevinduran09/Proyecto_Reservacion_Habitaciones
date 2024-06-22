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
export interface room {
    id: number;
    nombre: string;
    descripcion: string;
    disponibilidad: string;
    precioNoche: number;
    url: string;
    public_id: string;
    tipo_habitacion_id: number;
    tipo_cama_id: number;
    tipo_habitacion: typeRoom;
    tipo_cama: typeBed;
    servicios: services[];
}

export interface typeBed {
    id: number;
    tipo: string;
    descripcion: string;
}

export interface services {
    id: number;
    nombre: string;
    descripcion: string;
    costo: string;
    activo: number;
    created_at: null | string;
    updated_at: null | string;
    pivot: string;
}
