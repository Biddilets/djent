import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as soundActions from '../actions/sound';
import Visualiser from '../components/Visualiser';

const mapStateToProps = (state) => ({
    isPlaying            : state.sound.isPlaying,
    currentAudioTemplate : state.sound.currentAudioTemplate,
    sequences            : state.sequences,
    bpm                  : state.sound.generationState ? state.sound.generationState.bpm : 0,
});

const mapDispatchToProps = (dispatch) => {
    const actions = {
        ...soundActions,
    };
    return {
        actions: {
            ...bindActionCreators(actions, dispatch)
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Visualiser);
