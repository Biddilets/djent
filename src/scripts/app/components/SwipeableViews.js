import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { compose } from '../utils/tools';

const RESISTANCE_COEF = 0.4;
const UNCERTAINTY_THRESHOLD = 3; // px

const getFinalIndex = (roundingType, maxIndex, index) => compose(
    (v) => Math.max(0, v),
    (v) => Math.min(maxIndex, v),
    Math[roundingType]
)(index);

class SwipeableViews extends Component {
    static defaultProps = {
        index: 0,
        threshold: 5,
        resistance: false,
    }

    currentIndex;
    containerEl;
    rootEl;

    componentWillMount = () => {
        this.currentIndex = this.props.index;
    }

    componentDidMount = () => {
        this.containerEl = this.refs.container;
        this.rootEl = findDOMNode(this);
    }

    componentWillUpdate = (nextProps) => {
        if (this.currentIndex !== nextProps.index) {
            this.currentIndex = nextProps.index;
        }
    }

    onTouchStart = (event) => {
        const touch = event.touches[0];
        this.startWidth = this.rootEl.getBoundingClientRect().width;
        this.index = this.currentIndex;
        this.startX = touch.pageX;
        this.lastX = touch.pageX;
        this.vx = 0;
        this.startY = touch.pageY;
        this.isSwiping = undefined;
        this.started = true;

        this.containerEl.style.transition = 'none';
        this.loop();
    }

    onTouchMove = (event) => {
        if (!this.started) return this.onTouchStart(event);

        const touch = event.touches[0];

        // We don't know yet.
        if (this.isSwiping === undefined) {
          if (event.defaultPrevented) {
            this.isSwiping = false;
          } else {
            const dx = Math.abs(this.startX - touch.pageX);
            const dy = Math.abs(this.startY - touch.pageY);

            const isSwiping = dx > dy && dx > UNCERTAINTY_THRESHOLD;

            if (isSwiping === true || dx > UNCERTAINTY_THRESHOLD || dy > UNCERTAINTY_THRESHOLD) {
              this.isSwiping = isSwiping;
              this.startX = touch.pageX; // Shift the starting point.
            }
          }
        }

        if (this.isSwiping !== true) {
            this.started = false;
            return;
        }

        // Prevent native scrolling
        event.preventDefault();

        this.vx = this.vx * 0.5 + (touch.pageX - this.lastX) * 0.5;
        this.lastX = touch.pageX;

        const indexMax = this.props.children.length - 1;

        let index = this.currentIndex + (this.startX - touch.pageX) / this.startWidth;

        if (!this.props.resistance) {
            index = compose((v) => Math.min(indexMax, v), (v) => Math.max(0, v))(index);
            this.startX = touch.pageX;
        } else {
            if (index < 0) {
                index = Math.exp(index * RESISTANCE_COEF) - 1;
            } else if (index > indexMax) {
                index = indexMax + 1 - Math.exp((indexMax - index) * RESISTANCE_COEF);
            }
        }

        this.index = index;
    }

    onTouchEnd = () => {
        this.containerEl.style.transition = '';
        if (!this.started && this.isSwiping !== true) {
            return;
        }
        this.started = false;
        this.isSwiping = false;

        const pastSpeedThreshold = (Math.abs(this.vx) > this.props.threshold);
        const roundingType = pastSpeedThreshold
                           ? (this.vx > 0) ? 'floor' : 'ceil'
                           : 'round';

        const distanceTravelled = (this.startWidth * Math.abs(this.currentIndex - this.index));
        const time = Math.abs((this.startWidth - distanceTravelled) / this.vx) * 2;

        const index  = getFinalIndex(roundingType, this.props.children.length - 1, this.index);
        const pixels = Math.round(index * -this.startWidth);
        this.updateTranslation(pixels);

        if (pastSpeedThreshold && index !== this.currentIndex) {
            this.containerEl.style.transitionDuration = `${time}ms`;
            setTimeout(() => {
                this.containerEl.style.transitionDuration = '';
            }, time);
        }

        this.updateCurrentIndex(index);
    }

    loop = () => {
        if (this.started) {
            const pixels = Math.round(this.index * -this.startWidth);
            this.updateTranslation(pixels);
            requestAnimationFrame(this.loop);
        }
    }

    updateCurrentIndex = (index) => {
        this.currentIndex = index;
        if (this.props.onChangeIndex) this.props.onChangeIndex(index);
    }

    renderChildren = (children) => children
        .map((child, i) => (
            <div className="swipeable__slide" key={i}>
                { child }
            </div>
        ))

    updateTranslation = (pixels) => {
        this.containerEl.style.transform = `translate3d(${pixels}px, 0, 0)`;
    }

    render = () => (
        <div className="swipeable">
            <div
                className="swipeable__container"
                onTouchStart={this.onTouchStart}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
                ref="container"
                style={{
                    transform: `translate3d(${this.currentIndex * -100}%, 0, 0)`
                }}
            >
                { this.renderChildren(this.props.children) }
            </div>
        </div>
    );
}

export default SwipeableViews;
