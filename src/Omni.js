import reactotron from 'reactotron-react-native';
import {Constants} from '@green/common';
import _EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import _Timer from 'react-timer-mixin';
import _Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _IconIO from 'react-native-vector-icons/Ionicons';
import _Validate from './utils/Validate';

export const EventEmitter = new _EventEmitter();
export const Timer = _Timer;
export const Icon = _Icon;
export const IconIO = _IconIO;
export const Validate = _Validate;

const _log = (values) => __DEV__ && reactotron.log(values);
const _warn = (values) => __DEV__ && reactotron.warn(values);
const _error = (values) => __DEV__ && reactotron.error(values);
export function connectConsoleToReactotron() {
  console.log = _log;
  console.warn = _warn;
  console.error = _error;
}
export const log = _log;
export const warn = _warn;
export const error = _error;

/**
 * Display the message toast-like (work both with Android and iOS)
 * @param msg Message to display
 * @param duration Display duration
 */
export const toast = (msg, duration = 4000) =>
  EventEmitter.emit(Constants.EmitCode.Toast, msg, duration);
