import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Mutant Detector'
    );
  });

  it('should detect a mutant DNA sequence', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as any;
    const dna = [
      'ATGCGA',
      'CAGTGC',
      'TTATGT',
      'AGAAGG',
      'CCCCTA',
      'TCACTG',
    ];

    app.dnaGrid.set(dna.map((row: string) => row.split('')));
    app.checkMutant();

    expect(app.isMutantResult()).toBe(true);
    expect(app.result()).toBe('✅ Mutante detectado');
  });

  it('should reject a non-mutant DNA sequence', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as any;
    const dna = ['ATGCGA', 'CAGTGC', 'TTATTT', 'AGACGG', 'GCGTCA', 'TCACTG'];

    app.dnaGrid.set(dna.map((row: string) => row.split('')));
    app.checkMutant();

    expect(app.isMutantResult()).toBe(false);
    expect(app.result()).toBe('🧬 Humano normal');
  });

  it('should highlight valid sequences with alternating colors', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as any;

    const dna = [
      'AAAAAA',
      'AAAAAA',
      'AAAAAA',
      'AAAAAA',
      'AAAAAA',
      'AAAAAA',
    ];

    app.dnaGrid.set(dna.map((row: string) => row.split('')));
    app.checkMutant();

    const highlighted = [] as string[];
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const cls = app.getCellClass(r, c);
        if (cls) {
          highlighted.push(cls);
        }
      }
    }

    expect(highlighted.length).toBeGreaterThan(0);
    expect(highlighted).toContain('highlight-green');
    expect(highlighted).toContain('highlight-red');
    expect(highlighted).toContain('highlight-blue');
    expect(highlighted).toContain('highlight-yellow');
    expect(highlighted).toContain('highlight-purple');
  });
});