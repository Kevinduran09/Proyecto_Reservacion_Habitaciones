import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SweetAlertService } from './sweet-alert.service';
interface RoomData {
  rooms: any[];
}
export interface RoomReservation {
  roomIndex: number;
  roomDetails: any; // Detalles de la habitación seleccionada
  selected: boolean; // Si la habitación ha sido seleccionada
}
@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservationState = new BehaviorSubject<{
    roomSelections: RoomReservation[],
    currentSelectedRoomIndex: number,
    currentRoomIndex: number,
    totalRoomsNeeded: number,
    roomsDetails: RoomData,
    dataForm:any
  }>({
    roomSelections: [],
    currentSelectedRoomIndex: 0,
    currentRoomIndex: 0,
    totalRoomsNeeded: 0,
    roomsDetails: { rooms: [] },
    dataForm: null
  });
  currentReservationState = this.reservationState.asObservable();

  constructor(private sweel: SweetAlertService) { }
  // Establecer la reserva activa
  setActiveRoomReservation(index: number) {
    const state = this.reservationState.getValue();
    this.reservationState.next({ ...state, currentSelectedRoomIndex: index });
  }
  getAtiveRoomReservation(){
    const state = this.reservationState.getValue()
    return state.currentSelectedRoomIndex
  }
  // Configura el número total de habitaciones necesarias y los detalles de cada habitación
  setTotalRoomsNeeded(roomsDetails: RoomData) {
    const currentState = this.reservationState.getValue();
    this.reservationState.next({
      ...currentState,
      totalRoomsNeeded: roomsDetails.rooms.length,
      roomsDetails: roomsDetails
    });
  }

  setDataForm(data: any) {
    const currentState = this.reservationState.getValue();
    this.reservationState.next({
      ...currentState,
      dataForm: data
    });
  }
  
  getDataForm() {
    return this.reservationState.getValue().dataForm;
  }

  allRoomsSelected(): boolean {
    const state = this.reservationState.getValue();
    console.log(state.roomSelections.length);
    return state.roomSelections.length !== 0 && state.totalRoomsNeeded == state.roomSelections.length && state.roomSelections.every(room => room.selected ==true);
  }


  async addRoomSelection(room: any) {
    const currentState = this.reservationState.getValue();
   
    
   
    // Asegúrate de que hay un índice seleccionado y que existe un elemento en ese índice
    if (currentState.currentSelectedRoomIndex != null && currentState.roomSelections[currentState.currentSelectedRoomIndex]) {
      const currentReservation = currentState.roomSelections[currentState.currentSelectedRoomIndex];

      if (currentReservation.roomIndex === currentState.currentSelectedRoomIndex) {
        // Si ya se reservó una habitación para este índice y el usuario desea cambiarla
        let confirmChange = await this.sweel.showConfirm('Confirmación', `Ya anteriormente se reservó una habitación para la room ${currentState.currentSelectedRoomIndex + 1}. ¿Desea cambiarla?`, 'info', 'Sí, cambiar');
        if (!confirmChange) {
          return; // Si el usuario no confirma el cambio, termina la función.
        }
      }
     
    }
    const isAlreadyReserved = currentState.roomSelections.some(detail => detail.roomDetails.id === room.id);
    if (isAlreadyReserved) {
      this.sweel.showAlert({ text: 'Esta habitación ya ha sido reservada!', icon: 'warning', timer: 1500 });
      return; // Detener la función si la habitación ya está reservada
    }
    // Procede a actualizar o agregar la selección de la habitación
    this.updateRoomSelection(room, currentState);
  }
  updateRoomSelection(room: any, currentState: any) {

    if (currentState.roomSelections.some((reservation: { roomDetails: { id: any; }; roomIndex: any; }) => reservation.roomDetails.id === room.id && reservation.roomIndex === currentState.currentSelectedRoomIndex)) {
      this.sweel.showAlert({ text: 'Esta habitación ya ha sido reservada para la selección actual!', icon: 'warning', timer: 1500 });
      return;
    }

    // Aquí agregarías o actualizarías la habitación seleccionada
    if (currentState.currentRoomIndex < currentState.totalRoomsNeeded) {
      const updatedSelections = currentState.roomSelections.slice(); // Clona el array para evitar mutaciones directas
      updatedSelections[currentState.currentSelectedRoomIndex] = {
        roomIndex: currentState.currentSelectedRoomIndex,
        roomDetails: room,
        selected: true
      };

      this.reservationState.next({
        ...currentState,
        roomSelections: updatedSelections,
        currentRoomIndex: currentState.currentRoomIndex + 1 // Incrementa para preparar la siguiente selección
      });
      this.sweel.showToast(`Se selecciono la habitacion`,'success')
    } else {
      this.sweel.showAlert({ text: 'Ya se seleccionaron todas las habitaciones', icon: 'info', timer: 1500 });
    }
  }

  removeRoomSelection(index: number) {
    let state = this.reservationState.getValue();
    let updatedSelections = [...state.roomSelections];
    updatedSelections.splice(index, 1); // Elimina la habitación seleccionada
    this.reservationState.next({ ...state, roomSelections: updatedSelections });
  }

  // Obtiene las selecciones actuales de habitaciones
  getCurrentSelections() {
    return this.reservationState.getValue().roomSelections;
  }

  // Resetea las selecciones de habitaciones y detalles
  resetRoomSelections() {
    this.reservationState.next({
      roomSelections: [],
      currentSelectedRoomIndex: 0,
      currentRoomIndex: 0,
      totalRoomsNeeded: 0,
      roomsDetails: { rooms: [] },
      dataForm:null
    });
  }

  updateReservationState(state: any) {

    const currentState = this.reservationState.getValue();
    this.reservationState.next({
      ...currentState,
      ...state
    });
  }
  // // Método para actualizar los detalles de una habitación específica
  // updateRoomDetails(index: number, newDetails: any) {
  //   const currentState = this.reservationState.getValue();
  //   let newRoomsDetails = [...currentState.roomsDetails];
  //   newRoomsDetails[index] = newDetails;

  //   this.updateReservationState({ roomsDetails: newRoomsDetails });
  // }
}
