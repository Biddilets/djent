import React, { Component } from 'react';
import { capitalize } from '../utils/tools';
import { predefinedSequences } from '../utils/sequences';

import Expandable from './Expandable';
import PitchController from './PitchController';
import SequenceController from './SequenceController';
import SVG from './SVG';

export default class InstrumentList extends Component {
    onSoundToggle = (event) => {
        const soundID = event.target.getAttribute('id');
        const parentID = event.target.getAttribute('data-parent-id');
        const currentValue = this.props.instruments.find(i => i.id === parentID).sounds.find(s => s.id === soundID).enabled;
        const prop = 'enabled';
        const value = !currentValue;

        this.props.actions.updateInstrumentSound({ soundID, parentID, prop, value });
    }

    launchSettings = instrument => {
        const customBeats = this.props.beats
            .filter(b => b.id !== 'total')
            .reduce((newObj, b) => ({
                ...newObj,
                [b.id]: { description: b.description, id: b.id }
            }), {});
        const content = (
            <InstrumentSettingsPane
                instrument={instrument}
                sequences={{ ...customBeats, ...predefinedSequences }}
                actions={
                    {
                        disableModal: this.props.actions.disableModal,
                        updateInstrumentSequences: this.props.actions.updateInstrumentSequences,
                        updateInstrumentPitch: this.props.actions.updateInstrumentPitch,
                    }
                }
            />
        );
        this.props.actions.enableModal({ content, isCloseable: true, title: `${ instrument.description || instrument.id } Settings` });
    }

    render = () => {
        const instrumentViews = this.props.instruments
            .map((instrument, index) => {
                let categories = instrument.sounds
                    .reduce((cats, sound) => {
                        if (!cats.includes(sound.category)) {
                            return [
                                ...cats,
                                sound.category
                            ]
                        }
                        return cats;
                    }, [])
                    .map((id, index) => {
                        const sounds = instrument.sounds
                            .filter(sound => sound.category === id);
                        const isExpanded = !!sounds.find(sound => sound.enabled);

                        return (
                            <Expandable
                                title={ id || `${(instrument.description || capitalize(instrument.id))}` }
                                className="expandable-list u-mb05"
                                titleClassName="expandable-list__title"
                                bodyClassName="expandable-list__body"
                                isExpanded={isExpanded}
                                key={index}
                            >
                                <ul className="cleanlist">
                                    {sounds.map((sound, i) => (
                                        <li id={sound.id} data-parent-id={instrument.id} onClick={this.onSoundToggle} className={`toggle-input ${sound.enabled ? 'is-enabled' : ''}`} key={i} >{sound.description || sound.id}</li>
                                    ))}
                                </ul>
                            </Expandable>
                        );
                    });

                return (
                    <div className="u-mb2" key={index}>
                        <div className="u-flex-row" key={index}>
                            <span onClick={e => this.launchSettings(instrument)}><SVG icon="gear" className="icon-inline u-mr025 u-curp u-txt-dark" /></span>
                            <h3 className="title-secondary u-mb05">{instrument.description || instrument.id}</h3>
                        </div>
                        {categories}
                    </div>
                );
            });

        return (
            <div>
               {instrumentViews}
            </div>
        );
    }
}

const InstrumentSettingsPane = ({ instrument, actions, sequences }) => (
    <div>
        <div className="u-mb1">
            <SequenceController
                instrumentID={instrument.id}
                instrumentSequences={instrument.sequences}
                sequences={sequences}
                actions={{ updateInstrumentSequences: actions.updateInstrumentSequences }}
            />
        </div>
        <div className="u-mb1">
            <PitchController pitch={instrument.pitch} id={instrument.id} actions={{ updateInstrumentPitch: actions.updateInstrumentPitch }} />
        </div>
        <button className="button-primary button-primary--small button-primary--positive" onClick={ actions.disableModal } >Continue</button>
    </div>
);
