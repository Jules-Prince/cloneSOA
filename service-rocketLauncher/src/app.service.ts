import {Injectable} from '@nestjs/common';
import {State} from './utils/State';
import {Logger, ILogObj} from "tslog";

@Injectable()
export class AppService {
    private readonly log: Logger<ILogObj> = new Logger();
    private readonly logPrefix = "[Rocket launcher]";
    state = new State();

    getGoLiftOff(): Object {
        this.log.info(`${this.logPrefix}3, 2 ,1 , LIFT OFF !!`);
        this.log.info(`${this.logPrefix}  `);
        this.log.info(`${this.logPrefix}                   /\\`);
        this.log.info(`${this.logPrefix}                  //\\\\`);
        this.log.info(`${this.logPrefix}                 ||##||`);
        this.log.info(`${this.logPrefix}                //##mm\\\\`);
        this.log.info(`${this.logPrefix}               //##*mmm\\\\`);
        this.log.info(`${this.logPrefix}              //###**mmm\\\\`);
        this.log.info(`${this.logPrefix}             //###***nmmm\\\\`);
        this.log.info(`${this.logPrefix}            //####***@nmmm\\\\`);
        this.log.info(`${this.logPrefix}            ||####***@nnmm||`);
        this.log.info(`${this.logPrefix}            ||####**@@@nnm||`);
        this.log.info(`${this.logPrefix}            |______________|`);
        this.log.info(`${this.logPrefix}            |              |`);
        this.log.info(`${this.logPrefix}             \\____________/`);
        this.log.info(`${this.logPrefix}              |          |`);
        this.log.info(`${this.logPrefix}             /|    /\\    |\\`);
        this.log.info(`${this.logPrefix}            /_|    || /\\ |_\\`);
        this.log.info(`${this.logPrefix}              |           |`);
        this.log.info(`${this.logPrefix}              |       \\/ |`);
        this.log.info(`${this.logPrefix}              |          |`);
        this.log.info(`${this.logPrefix}             /|    /\\    |\\`);
        this.log.info(`${this.logPrefix}            / |    ||    | \\`);
        this.log.info(`${this.logPrefix}           /  |    ||    |  \\`);
        this.log.info(`${this.logPrefix}          /  /\\    ||    /\\  \\`);
        this.log.info(`${this.logPrefix}         |__/  \\   ||   /  \\__|`);
        this.log.info(`${this.logPrefix}           /____\\      /____\\`);
        this.log.info(`${this.logPrefix}           |    |      |    |`);
        this.log.info(`${this.logPrefix}           |    |______|    |`);
        this.log.info(`${this.logPrefix}           |    | /--\\ |    |`);
        this.log.info(`${this.logPrefix}           |____|/----\\|____|`);
        this.log.info(`${this.logPrefix}            \\||/ //##\\\\ \\||/`);
        this.log.info(`${this.logPrefix}            /##\\//####\\\\/##\\`);
        this.log.info(`${this.logPrefix}           //##\\\\/####\\//##\\\\`);
        this.log.info(`${this.logPrefix}          ||/::\\||/##\\||/::\\||`);
        this.log.info(`${this.logPrefix}          \\\\\\\'///:**:\\\\\\\'///`);
        this.log.info(`${this.logPrefix}           \\\\\\///\\::::/\\\\\\///`);
        this.log.info(`${this.logPrefix}            \\\\//\\\\\\::///\\\\//`);
        this.log.info(`${this.logPrefix}             \\/\\\\\\\\..////\\/`);
        this.log.info(`${this.logPrefix}                \\\\\\\\////`);
        this.log.info(`${this.logPrefix}                 \\\\\\///`);
        this.log.info(`${this.logPrefix}                  \\\\//`);
        this.log.info(`${this.logPrefix}                   \\/`);

        return {"status": this.state.GO};
    }
}
