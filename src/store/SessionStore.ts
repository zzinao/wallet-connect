import { SessionTypes } from '@walletconnect/types';
import { proxy } from 'valtio';

/**
 * Types
 */
interface State {
  session?: SessionTypes.Struct;
}

/**
 * State
 */
const state = proxy<State>({});

/**
 * Store / Actions
 */

const SessionStore = {
  state,
  setSession(session: State['session']) {
    state.session = session;
  },
};

export default SessionStore;
