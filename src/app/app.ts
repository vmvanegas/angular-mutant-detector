import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

const GRID_SIZE = 6;
const VALID_BASES = new Set(['A', 'T', 'C', 'G']);
const MIN_SEQUENCE_LENGTH = 4;
const HIGHLIGHT_CLASSES = [
  'highlight-green',
  'highlight-red',
  'highlight-blue',
  'highlight-yellow',
  'highlight-purple',
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Mutant Detector');
  protected readonly dnaGrid = signal<string[][]>([
    ['A', 'T', 'G', 'C', 'G', 'A'],
    ['C', 'A', 'G', 'T', 'G', 'C'],
    ['T', 'T', 'A', 'T', 'G', 'T'],
    ['A', 'G', 'A', 'A', 'G', 'G'],
    ['C', 'C', 'C', 'C', 'T', 'A'],
    ['T', 'C', 'A', 'C', 'T', 'G'],
  ]);
  protected readonly result = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly isMutantResult = signal<boolean | null>(null);
  protected readonly highlightedCells = signal<string[][]>(
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(''))
  );

  public setCell(row: number, col: number, value: string) {
    const letter = value.trim().toUpperCase().slice(0, 1);
    const newGrid = this.dnaGrid().map((rowValues, rowIndex) =>
      rowIndex === row ? [...rowValues] : [...rowValues]
    );
    newGrid[row][col] = VALID_BASES.has(letter) ? letter : '';
    this.dnaGrid.set(newGrid);
  }

  public onCellInput(row: number, col: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const letter = value.trim().toUpperCase().slice(0, 1);

    this.setCell(row, col, letter);

    console.log(`Input en celda [${row}, ${col}]:`, letter);
    if (VALID_BASES.has(letter)) {
      Promise.resolve().then(() => this.focusNextCell(row, col));
    } else {
      input.value = '';
    }
  }

  protected focusNextCell(row: number, col: number) {
    const nextRow = col === GRID_SIZE - 1 ? row + 1 : row;
    const nextCol = col === GRID_SIZE - 1 ? 0 : col + 1;
    if (nextRow >= GRID_SIZE) {
      return;
    }

    const nextInput = document.getElementById(
      `dna-cell-${nextRow}-${nextCol}`
    ) as HTMLInputElement | null;
    if (!nextInput) {
      return;
    }

    Promise.resolve().then(() => {
      nextInput.focus();
      if (nextInput.value.length > 0) {
        nextInput.setSelectionRange(0, nextInput.value.length);
      }
    });
  }

  public selectCell(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 0) {
      input.setSelectionRange(0, input.value.length);
    }
  }

  public trackByIndex(index: number) {
    return index;
  }

  protected getDnaRows(): string[] {
    return this.dnaGrid().map((row) => row.join(''));
  }

  public checkMutant() {
    this.result.set(null);
    this.error.set(null);
    this.isMutantResult.set(null);
    this.clearHighlights();

    if (this.dnaGrid().some((row) => row.some((cell) => cell === ''))) {
      this.error.set('Completa todas las celdas antes de validar.');
      return;
    }

    const dna = this.getDnaRows();
    if (!this.hasValidBases(dna)) {
      this.error.set('Solo se permiten las letras A, T, C y G en el ADN.');
      return;
    }

    const sequences = this.findValidSequences(dna);
    if (sequences.length > 0) {
      this.highlightSequences(sequences);
    }

    const mutant = sequences.length > 1;
    this.isMutantResult.set(mutant);
    this.result.set(mutant ? '✅ Mutante detectado' : '🧬 Humano normal');
  }

  protected hasValidBases(dna: string[]) {
    return dna.every((row) => [...row].every((base) => VALID_BASES.has(base)));
  }

  protected clearHighlights() {
    this.highlightedCells.set(
      Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(''))
    );
  }

  protected highlightSequences(sequences: Array<Array<[number, number]>>) {
    const highlights = Array.from({ length: GRID_SIZE }, () =>
      Array(GRID_SIZE).fill('')
    );

    sequences.forEach((sequence, index) => {
      const highlightClass = HIGHLIGHT_CLASSES[index % HIGHLIGHT_CLASSES.length];
      sequence.forEach(([row, col]) => {
        highlights[row][col] = highlightClass;
      });
    });

    this.highlightedCells.set(highlights);
  }

  public getCellClass(row: number, col: number) {
    return this.highlightedCells()[row][col] || '';
  }

  protected findValidSequences(dna: string[]) {
    const n = dna.length;
    const grid = dna.map((row) => row.split(''));
    const directions = [
      { dr: 0, dc: 1 },
      { dr: 1, dc: 0 },
      { dr: 1, dc: 1 },
      { dr: 1, dc: -1 },
    ];
    const sequences: Array<Array<[number, number]>> = [];

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const base = grid[r][c];
        for (const { dr, dc } of directions) {
          if (this.hasSequenceFrom(grid, r, c, dr, dc, base)) {
            const sequence: Array<[number, number]> = [];
            for (let i = 0; i < MIN_SEQUENCE_LENGTH; i++) {
              sequence.push([r + dr * i, c + dc * i]);
            }
            sequences.push(sequence);
          }
        }
      }
    }

    return sequences;
  }

  protected hasSequenceFrom(
    grid: string[][],
    row: number,
    col: number,
    dr: number,
    dc: number,
    base: string
  ) {
    const n = grid.length;
    for (let i = 1; i < MIN_SEQUENCE_LENGTH; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= n || c < 0 || c >= n || grid[r][c] !== base) {
        return false;
      }
    }
    return true;
  }
}
