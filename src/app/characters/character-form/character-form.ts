import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Character } from '../../models/character';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-character-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './character-form.component.html',
  styleUrl: './character-form.component.scss'
})
export class CharacterFormComponent implements OnInit {
  characterForm: FormGroup;
  isEditMode = false;
  characterId?: number;
  loading = false;
  submitting = false;
  error: string | null = null;
  
  classOptions = [
    'Warrior', 'Mage', 'Rogue', 'Cleric', 'Paladin', 
    'Ranger', 'Druid', 'Bard', 'Monk', 'Warlock'
  ];
  
  raceOptions = [
    'Human', 'Elf', 'Dwarf', 'Orc', 'Halfling', 
    'Gnome', 'Half-Elf', 'Half-Orc', 'Dragonborn', 'Tiefling'
  ];

  constructor(
    private fb: FormBuilder,
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.characterForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      class: ['Warrior', Validators.required],
      level: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      weapon: ['', [Validators.required, Validators.minLength(2)]],
      race: ['Human'],
      backstory: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.characterId = +id;
      this.loadCharacter(this.characterId);
    }
  }

  loadCharacter(id: number): void {
    this.loading = true;
    this.characterService.getCharacter(id)
      .subscribe({
        next: (character) => {
          this.characterForm.patchValue(character);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading character', err);
          this.error = 'Failed to load character data';
          this.loading = false;
        }
      });
  }

  onSubmit(): void {
    if (this.characterForm.invalid) {
      this.markFormGroupTouched(this.characterForm);
      return;
    }

    this.submitting = true;
    const character: Character = this.characterForm.value;

    const request = this.isEditMode && this.characterId
      ? this.characterService.updateCharacter(this.characterId, character)
      : this.characterService.createCharacter(character);

    request.subscribe({
      next: (result) => {
        this.submitting = false;
        this.router.navigate(['/characters', result.id]);
      },
      error: (err) => {
        console.error('Error saving character', err);
        this.error = `Failed to ${this.isEditMode ? 'update' : 'create'} character`;
        this.submitting = false;
      }
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Form validation helpers
  hasError(controlName: string, errorName: string): boolean {
    const control = this.characterForm.get(controlName);
    return (control?.touched || control?.dirty) && control?.hasError(errorName) || false;
  }

  cancel(): void {
    if (this.isEditMode && this.characterId) {
      this.router.navigate(['/characters', this.characterId]);
    } else {
      this.router.navigate(['/characters']);
    }
  }
}