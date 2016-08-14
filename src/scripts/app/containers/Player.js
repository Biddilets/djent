import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Player from '../routes/Player';

import * as modalActions from '../actions/modal';
import { updateSequence } from '../actions/sequences';

function mapStateToProps(state) {
    return {
        bpm                  : state.config.bpm,
        sequences            : state.sequences,
        currentAudioTemplate : state.sound.currentAudioTemplate,
        instruments          : state.instruments,
    };
}

function mapDispatchToProps(dispatch) {
    const actions = {
        ...modalActions,
        updateSequence
    };

    return {
        actions: {
            ...bindActionCreators(actions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
