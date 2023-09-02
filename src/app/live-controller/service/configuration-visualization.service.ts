import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LightColorType } from '../../shared/models/light-color.type';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationVisualizationService {
  private readonly MAX_POWER = 255;

  private colorSubject = new BehaviorSubject<string>('#ffffff');
  public color$ = this.colorSubject.asObservable();

  private opacitySubject = new BehaviorSubject<number>(1);
  opacity$ = this.opacitySubject.asObservable();

  private stroboscopeSubject = new BehaviorSubject<{
    enabled: boolean;
    frequency: number;
  }>({
    enabled: false,
    frequency: 0,
  });
  public stroboscope$ = this.stroboscopeSubject.asObservable();

  private pump1PowerSubject = new BehaviorSubject<number>(0);
  public pump1Power$ = this.pump1PowerSubject.asObservable();
  private pump2PowerSubject = new BehaviorSubject<number>(0);
  public pump2Power$ = this.pump2PowerSubject.asObservable();

  private foam1Subject = new BehaviorSubject<boolean>(false);
  public foam1$ = this.foam1Subject.asObservable();
  private foam2Subject = new BehaviorSubject<boolean>(false);
  public foam2$ = this.foam2Subject.asObservable();
  private foam3Subject = new BehaviorSubject<boolean>(false);
  public foam3$ = this.foam3Subject.asObservable();
  private jetsCountSubject = new BehaviorSubject<boolean[]>([true, true, true]);
  public jetsCount$ = this.jetsCountSubject.asObservable();
  private verticalJetToggledSubject = new Subject<void>();
  public verticalJetToggled$ = this.verticalJetToggledSubject.asObservable();
  private whiteBrightnessSubject = new BehaviorSubject<number>(0);
  public whiteBrightness$ = this.whiteBrightnessSubject.asObservable();
  private lightColorSubject = new BehaviorSubject<LightColorType>({
    number: 1,
    color: '#000000',
  });
  public lightColor$ = this.lightColorSubject.asObservable();

  public getLightColor(number: number, color: string): void {
    this.lightColorSubject.next({ number, color });
  }

  public getNumberOfVerticalJetsOn(jets: boolean[]): void {
    this.jetsCountSubject.next(jets);
  }

  public setPump1Power(level: number): void {
    level = level / this.MAX_POWER;
    this.pump1PowerSubject.next(level);
  }

  public setPump2Power(level: number): void {
    level = level / this.MAX_POWER;
    this.pump2PowerSubject.next(level);
  }

  public setColor(color: string): void {
    this.colorSubject.next(color);
  }

  public setOpacity(opacity: number): void {
    this.opacitySubject.next(opacity);
  }

  public setStroboscope(stroboscope: {
    enabled: boolean;
    frequency: number;
  }): void {
    this.stroboscopeSubject.next(stroboscope);
  }

  public setFoam1(enabled: boolean): void {
    this.foam1Subject.next(enabled);
  }

  public setFoam2(enabled: boolean): void {
    this.foam2Subject.next(enabled);
  }

  public setFoam3(enabled: boolean): void {
    this.foam3Subject.next(enabled);
  }

  public setWhiteBrightness(whiteBrightness: number): void {
    this.whiteBrightnessSubject.next(whiteBrightness / 255);
  }

  public verticalJetChange(): void {
    this.verticalJetToggledSubject.next(undefined);
  }
}
