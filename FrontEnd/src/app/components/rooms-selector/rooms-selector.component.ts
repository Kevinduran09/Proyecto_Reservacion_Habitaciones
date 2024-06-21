// room-selector.component.ts

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone:true,
  selector: 'app-rooms-selector',
  templateUrl: './rooms-selector.component.html',
  styleUrls: ['./rooms-selector.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class RoomSelectorComponent implements OnInit {
  @Input() roomData: any; // Datos de la habitación, si es necesario
  @Output() roomDataChange = new EventEmitter<any>();

  roomForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.roomForm = this.fb.group({
      rooms: this.fb.array([])
    });

    // Inicializa con una habitación
    this.addRoom();
  }

  get rooms(): FormArray {
    return this.roomForm.get('rooms') as FormArray;
  }

  addRoom() {
    const roomGroup = this.fb.group({
      countpeople: this.fb.control(1)
    });
    this.rooms.push(roomGroup);
  }

  setRooms(event: Event) {
    const element = event.target as HTMLInputElement;  // Asegura el tipo del target
    const numberOfRooms = Number(element.value);  // Convierte el valor a número
    const currentRoomCount = this.rooms.length;
    if (numberOfRooms > currentRoomCount) {
      for (let i = currentRoomCount; i < numberOfRooms; i++) {
        this.addRoom();
      }
    } else if (numberOfRooms < currentRoomCount) {
      this.rooms.controls.splice(numberOfRooms);
      this.rooms.updateValueAndValidity();
    }
  }

  onSubmit() {
  
    this.roomDataChange.emit(this.roomForm.value);
  }


}


