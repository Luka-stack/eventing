import { ConnectionAPI, ImmutableSocket } from '../socket-manager/manager';

let socket: ImmutableSocket | null = null;

export const SomeBackendProcessing = {
  start() {
    console.log('Backend processing started');
    socket = ConnectionAPI.connectOrJoin('/', true);
  },
  async turnOnFeeder() {
    console.log('Turning feeder on');
    const resp = await socket?.emitWithAck('feeder', { status: true });
    return resp;
  },
  turnOffFeeder() {
    console.log('Turning feeder off');
    socket?.emit('feeder', { status: false });
  },
  end() {
    console.log('Backend processing ended');
    socket?.offAll();
    socket = null;
  },
};
