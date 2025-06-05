import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Define the Character interface
export interface Character {
  id?: number;
  name: string;
  class: string;
  level: number;
  race?: string;
  weapon: string;
  backstory?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  // Updated URL without the /api prefix
  private apiUrl = '/characters';

  constructor(private http: HttpClient) { }

  getCharacters(): Observable<Character[]> {
    console.log('Fetching characters from:', this.apiUrl);
    return this.http.get<Character[]>(this.apiUrl)
      .pipe(
        tap(characters => console.log('Received characters:', characters)),
        catchError(this.handleError('getCharacters', []))
      );
  }

  getCharacter(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<Character>(`getCharacter id=${id}`))
      );
  }

  createCharacter(character: Character): Observable<Character> {
    return this.http.post<Character>(this.apiUrl, character)
      .pipe(
        catchError(this.handleError<Character>('createCharacter'))
      );
  }

  updateCharacter(character: Character): Observable<Character> {
    return this.http.put<Character>(`${this.apiUrl}/${character.id}`, character)
      .pipe(
        catchError(this.handleError<Character>('updateCharacter'))
      );
  }

  deleteCharacter(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<any>('deleteCharacter'))
      );
  }

  // New method to generate random characters
  generateRandomCharacters(count: number): Observable<Character[]> {
    return this.http.get<Character[]>(`${this.apiUrl}/random?count=${count}`)
      .pipe(
        catchError(this.handleError<Character[]>('generateRandomCharacters', []))
      );
  }

  // If your backend doesn't support this endpoint yet, you can use this fallback method
  // which generates random characters on the client side
  private generateRandomCharactersLocally(count: number): Observable<Character[]> {
    const firstNames = ['Gandalf', 'Aragorn', 'Legolas', 'Gimli', 'Frodo', 'Boromir', 'Faramir', 'Thorin', 'Bilbo', 'Galadriel'];
    const lastNames = ['the Grey', 'son of Arathorn', 'Greenleaf', 'son of Glóin', 'Baggins', 'of Gondor', 'of Ithilien', 'Oakenshield', 'Baggins', 'of Lothlorien'];
    const classes = ['Warrior', 'Mage', 'Rogue', 'Cleric', 'Paladin', 'Ranger', 'Druid', 'Bard', 'Monk', 'Warlock'];
    const races = ['Human', 'Elf', 'Dwarf', 'Orc', 'Halfling', 'Gnome', 'Half-Elf', 'Half-Orc', 'Dragonborn', 'Tiefling'];
    const weapons = ['Sword', 'Bow', 'Staff', 'Dagger', 'Axe', 'Mace', 'Warhammer', 'Spear', 'Shield', 'Wand'];
    const backstories = [
      'A noble warrior seeking vengeance for their fallen kingdom.',
      'A mysterious wanderer with amnesia, searching for their past.',
      'A scholar who discovered an ancient tome with dark secrets.',
      'A former criminal seeking redemption through heroic deeds.',
      'A farm hand who discovered they have magical powers.'
    ];

    const randomCharacters: Character[] = [];

    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      randomCharacters.push({
        id: Math.floor(Math.random() * 10000) + 1000,
        name: `${firstName} ${lastName}`,
        class: classes[Math.floor(Math.random() * classes.length)],
        level: Math.floor(Math.random() * 20) + 1,
        race: races[Math.floor(Math.random() * races.length)],
        weapon: weapons[Math.floor(Math.random() * weapons.length)],
        backstory: backstories[Math.floor(Math.random() * backstories.length)]
      });
    }

    console.log('Generated local characters:', randomCharacters);
    return of(randomCharacters);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      // If the error is from the random characters endpoint, fall back to local generation
      if (operation === 'generateRandomCharacters' && Array.isArray(result) && result.length === 0) {
        console.log('Falling back to locally generated characters');
        return this.generateRandomCharactersLocally(5) as Observable<T>;
      }
      
      // If we get an error trying to load characters, generate some locally
      if (operation === 'getCharacters' && Array.isArray(result)) {
        console.log('Loading characters failed. Generating locally...');
        return this.generateRandomCharactersLocally(5) as Observable<T>;
      }
      
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}