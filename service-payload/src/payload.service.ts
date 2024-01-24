import { Injectable } from '@nestjs/common';
import { Measure } from './dto/measure.dto';

@Injectable()
export class PayloadService {
  // Constants
  static G: number = 6.6743e-11; // Constante gravitationnelle (m^3/kg/s^2)
  static M: number = 5.972e24; // Masse de la Terre (kg)
  static R: number = 6371; // Rayon de la Terre (km)

  static startTime = Date.now();

  // État initial
  radius: number = 700; // Rayon orbital (km)
  velocity: number = 7.66; // Vitesse initiale (km/s)
  theta: number = 0; // Angle initial (radians)

  // Simulate the position of satellite after a given time (in second)
  simulate(time: number): { x: number; y: number } {
    const angularVelocity = (this.velocity * 1000) / (this.radius * 1000); // Conversion des km en mètres

    // Calculer le nouvel angle après le temps donné
    this.theta = (this.theta + angularVelocity * time) % (2 * Math.PI);

    // Calculer la position du satellite en coordonnées polaires
    const x = this.radius * Math.cos(this.theta);
    const y = this.radius * Math.sin(this.theta);

    return { x: x, y: y };
  }

  measureRadiation(): Measure {
    let result = Math.random();
    result = Math.pow(result, 3);
    result = result * 150 + 1;
    result = Math.floor(result);
    console.log(result);
    return new Measure(result);
  }
}
