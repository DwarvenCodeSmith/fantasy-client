import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Character } from '../models/character';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private apiUrl = '/api/characters'; 

  constructor(private http: HttpClient) { }

  getCharacters(): Observable<Character[]> {
    return this.http.get<Character[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCharacter(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createCharacter(character: Character): Observable<Character> {
    return this.http.post<Character>(this.apiUrl, character)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateCharacter(id: number, character: Character): Observable<Character> {
    return this.http.put<Character>(`${this.apiUrl}/${id}`, character)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteCharacter(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  generateRandomCharacters(count: number = 5): Observable<Character[]> {
    return this.http.post<Character[]>(`${this.apiUrl}/batch/${count}`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}