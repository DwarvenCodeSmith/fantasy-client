import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  private apiUrl = '/api/characters'; // Update with your actual API URL

  constructor(private http: HttpClient) { }

  getCharacters(): Observable<Character[]> {
    return this.http.get<Character[]>(this.apiUrl)
      .pipe(
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

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}