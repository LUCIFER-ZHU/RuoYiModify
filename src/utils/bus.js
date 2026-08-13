/**
 * 事件总线，用于跨组件通信
 */
import mitt from 'mitt';

const bus = mitt();

export default bus;
