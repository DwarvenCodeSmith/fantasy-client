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
    this.error = null;
    
    console.log('Loading characters...');
    this.characterService.getCharacters()
      .subscribe({
        next: (data) => {
          console.log('Characters loaded:', data);
          this.characters = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading characters:', err);
          this.error = 'Failed to load characters. Please try again.';
          this.loading = false;
        },
        complete: () => {
          console.log('Character loading complete');
          this.loading = false;
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
    this.error = null;
    
    console.log('Generating random characters...');
    this.characterService.generateRandomCharacters(5)
      .subscribe({
        next: (data) => {
          console.log('Random characters generated:', data);
          this.characters = [...this.characters, ...data];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error generating characters', err);
          this.error = 'Failed to generate characters';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}