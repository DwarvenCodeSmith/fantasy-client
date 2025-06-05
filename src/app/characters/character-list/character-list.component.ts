import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Character } from '../../models/character';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss'
})
export class CharacterListComponent implements OnInit {
  characters: Character[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.loading = true;
    this.characterService.getCharacters()
      .subscribe({
        next: (data) => {
          this.characters = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load characters';
          this.loading = false;
          console.error(err);
        }
      });
  }

  deleteCharacter(id?: number): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this character?')) {
      this.characterService.deleteCharacter(id)
        .subscribe({
          next: () => {
            this.characters = this.characters.filter(character => character.id !== id);
          },
          error: (err) => {
            console.error('Error deleting character', err);
            this.error = 'Failed to delete character';
          }
        });
    }
  }

  generateCharacters(): void {
    this.loading = true;
    this.characterService.generateRandomCharacters(5)
      .subscribe({
        next: (data) => {
          this.characters = [...this.characters, ...data];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error generating characters', err);
          this.error = 'Failed to generate characters';
          this.loading = false;
        }
      });
  }
}