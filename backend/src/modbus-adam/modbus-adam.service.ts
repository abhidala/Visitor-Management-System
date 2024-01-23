import { Injectable } from '@nestjs/common';
const Modbus = require('modbus-serial');

@Injectable()
export class ModbusService {
  private client: any; // You may want to type this appropriately

  async connectModbusServer(serverIP: string, serverPort: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = new Modbus();
      this.client.connectTCP(serverIP, { port: serverPort }, (err) => {
        if (err) {
          console.error('Error connecting to Modbus TCP server:', err);
          reject(err);
        } else {
          console.log(`Connected to Modbus TCP server ${serverPort}`);
          resolve();
        }
      });
    });
  }

  async toggleCoil(
    serverIP: string,
    serverPort: number,
    discreteInputAddress: number,
    coilAddress: number,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.connectModbusServer(serverIP, serverPort);

      const isDiscreteInputFalse = await this.client.readDiscreteInputs(discreteInputAddress, 1);

      if (isDiscreteInputFalse.data[0] === false) {
        const currentCoilValue = await this.client.readCoils(coilAddress, 1);

        if (currentCoilValue.data[0] === true) {
          await this.client.writeCoil(coilAddress, false);
        } else {
          await this.client.writeCoil(coilAddress, true);
        }

        return { success: true, message: 'Coil toggled successfully' };
      } else {
        return { success: false, message: 'Discrete input is not false, cannot toggle the coil' };
      }
    } catch (err) {
      return { success: false, message: `Error: ${err.message}` };
    } finally {
      this.client.close(() => {
        console.log('Modbus connection closed.');
      });
    }
  }
}
