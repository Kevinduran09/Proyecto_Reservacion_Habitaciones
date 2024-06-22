import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SweetAlertService } from './sweet-alert.service';
interface RoomData {
  rooms: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservationState = new BehaviorSubject<{
    roomSelections: any[],
    currentRoomIndex: number,
    totalRoomsNeeded: number,
    roomsDetails: RoomData
  }>({
    roomSelections: [],
    currentRoomIndex: 0,
    totalRoomsNeeded: 0,
    roomsDetails: { rooms: [] }
  });
  currentReservationState = this.reservationState.asObservable();

  constructor(private sweel:SweetAlertService) { }

  // Configura el número total de habitaciones necesarias y los detalles de cada habitación
  setTotalRoomsNeeded(roomsDetails: RoomData) {
    const currentState = this.reservationState.getValue();
    this.reservationState.next({
      ...currentState,
      totalRoomsNeeded: roomsDetails.rooms.length,
      roomsDetails: roomsDetails
    });
  }

  // Agrega una selección de habitación al estado
  addRoomSelection(room: any) {
    console.log(room);
    
    const currentState = this.reservationState.getValue();

    const coincidencia = currentState.roomSelections.some(existingRoom => existingRoom.id == room.id)
    if(coincidencia){
      this.sweel.showAlert({text:'Ya reservaste esta habitacion!',icon:'warning',timer:1500})
      return
    }

    if (currentState.currentRoomIndex < currentState.totalRoomsNeeded) {
      const updatedSelections = [...currentState.roomSelections, room];
      this.reservationState.next({
        ...currentState,
        roomSelections: updatedSelections,
        currentRoomIndex: currentState.currentRoomIndex + 1
      });
    }else{
      this.sweel.showAlert({text:'Ya se selecionaron todas las habitaciones',icon:'info',timer:1500})
    }
    
  }

  // Obtiene las selecciones actuales de habitaciones
  getCurrentSelections() {
    return this.reservationState.getValue().roomSelections;
  }

  // Resetea las selecciones de habitaciones y detalles
  resetRoomSelections() {
    this.reservationState.next({
      roomSelections: [],
      currentRoomIndex: 0,
      totalRoomsNeeded: 0,
      roomsDetails: { rooms: [] }
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
