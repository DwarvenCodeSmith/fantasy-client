import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Character } from '../../models/character';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.scss'
})
export class CharacterDetailComponent implements OnInit {
  character?: Character;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCharacter(+id);
    } else {
      this.error = 'No character ID provided';
      this.loading = false;
    }
  }

  loadCharacter(id: number): void {
    this.characterService.getCharacter(id)
      .subscribe({
        next: (data) => {
          this.character = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading character', err);
          this.error = 'Failed to load character';
          this.loading = false;
        }
      });
  }

  deleteCharacter(): void {
    if (!this.character?.id) return;
    
    if (confirm('Are you sure you want to delete this character?')) {
      this.characterService.deleteCharacter(this.character.id)
        .subscribe({
          next: () => {
            this.router.navigate(['/characters']);
          },
          error: (err) => {
            console.error('Error deleting character', err);
            this.error = 'Failed to delete character';
          }
        });
    }
  }
}