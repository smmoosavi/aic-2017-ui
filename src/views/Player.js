import React, {Component} from 'react';
import Immutable from 'immutable';
import cx from 'classnames';

class Floor extends Component {
    render() {
        const {x, y}= this.props;
        const style = {
            left: 64 * x,
            top: 64 * y,

        };
        return <div className="floor" style={style}></div>
    }
}

class Bug extends Component {
    render() {
        const {data}= this.props;
        const {x, y, direction, color, queen, sick, team} = data.toJS();
        console.log(data + '');
        const style = {
            left: 64 * x,
            top: 64 * y,

        };
        const dir = ['to-left', 'to-down', 'to-right', 'to-up'][direction];

        const className = cx("bug", color ? 'up' : 'down', 'team' + team, {sick, queen}, dir);
        return <div className={className} style={style}></div>;
    }
}

class Food extends Component {
    render() {
        const {data}= this.props;
        const {x, y} = data.toJS();
        const style = {
            left: 64 * x,
            top: 64 * y,

        };
        return <div className="food" style={style}></div>;
    }
}

class Trash extends Component {
    render() {
        const {data}= this.props;
        const {x, y} = data.toJS();
        const style = {
            left: 64 * x,
            top: 64 * y,

        };
        return <div className="trash" style={style}></div>;
    }
}


class Net extends Component {
    render() {
        const {data}= this.props;
        const {x, y} = data.toJS();
        const style = {
            left: 64 * x,
            top: 64 * y,

        };
        return <div className="net" style={style}></div>;
    }
}


class Teleport extends Component {
    render() {
        const {data}= this.props;
        const {x, y} = data.toJS();
        const style = {
            left: 64 * x,
            top: 64 * y,

        };
        return <div className="teleport" style={style}></div>;
    }
}

class Board extends Component {
    render() {
        const {w, h, data}= this.props;
        const children = [];
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                children.push(<Floor x={i} y={j} key={`Fl-${i}-${j}`}/>)
            }
        }
        const bees = data.get('bees');

        bees.forEach((bee) => {
            const id = bee.get('id');
            children.push(<Bug data={bee} key={`Be-${id}`}/>);
        });

        const foods = data.get('foods');
        foods.forEach((food) => {
            const id = food.get('id');
            children.push(<Food data={food} key={`Fo-${id}`}/>);
        });

        const trashes = data.get('trashes');
        trashes.forEach((trash) => {
            const id = trash.get('id');
            children.push(<Trash data={trash} key={`Tr-${id}`}/>);
        });

        const nets = data.get('nets');
        nets.forEach((net) => {
            const id = net.get('id');
            children.push(<Net data={net} key={`Fo-${id}`}/>);
        });

        const teleports = data.get('teleports');
        teleports.forEach((teleport) => {
            const id = teleport.get('id');
            children.push(<Teleport data={teleport} key={`Fo-${id}`}/>);
        });

        const style = {
            width: 64 * w,
            height: 64 * h,
        };
        return <div className="board" style={style}>
            {children}
            <h1 className="to-right">E</h1>
        </div>
    }
}

const convertBee = ([id, x, y, direction, color, queen, sick, team]) => {
    return Immutable.Map({id, x, y, direction, color, queen, sick, team});
};
const convertFood = ([id, x, y]) => {
    return Immutable.Map({id, x, y});
};
const convertTrash = ([id, x, y]) => {
    return Immutable.Map({id, x, y});
};
const convertNet = ([id, x, y]) => {
    return Immutable.Map({id, x, y});
};
const convertTeleport = ([id, x, y, out]) => {
    return Immutable.Map({id, x, y, out});
};

const convertTurn = ([turn, scores, diffs]) => {
    return {turn, scores, diffs};
};

const getResetData = (init) => {
    const [, , , bees, foods, trashes, nets, teleports] = init.args;
    const beeMap = Immutable.Map(bees.map(convertBee).map(bee => [bee.get('id'), bee]));
    const foodMap = Immutable.Map(foods.map(convertFood).map(food => [food.get('id'), food]));
    const trashMap = Immutable.Map(trashes.map(convertTrash).map(trash => [trash.get('id'), trash]));
    const netMap = Immutable.Map(nets.map(convertNet).map(net => [net.get('id'), net]));
    const teleportMap = Immutable.Map(teleports.map(convertTeleport).map(teleport => [teleport.get('id'), teleport]));
    return Immutable.Map({
        turn: 0,
        scores: [0, 0],
        bees: beeMap,
        foods: foodMap,
        trashes: trashMap,
        nets: netMap,
        teleports: teleportMap,
    });
};

const indexTurns = (updates) => {
    return Immutable.Map()
        .withMutations((map) => {
            updates.forEach((update) => {
                if (update.name === 'turn') {
                    const turn = convertTurn(update.args);
                    map.set(turn.turn, turn);
                }
            });
        });
};

export default class Player extends Component {
    constructor(props) {
        super(props);
        const {init, updates} = props.data;
        const [, w, h] = init.args;
        const data = getResetData(init);
        this.tid = null;
        this.updates = indexTurns(updates);
        this.state = {
            size: {w, h},
            data,
        };
    }

    reset = () => {
        this.pause();
        this.setState(() => {
            const data = getResetData(this.props.data.init);
            return {data};
        });
    };

    play = () => {
        this.tid = setInterval(this.turn, 400);
    };


    togglePlay = () => {
        if (this.tid === null) {
            this.play();
        } else {
            this.pause();
        }
    };

    pause = () => {
        if (this.tid !== null) {
            clearInterval(this.tid);
            this.tid = null;
        }
    };

    applyDiff = (map, diff) => {
        if (diff.type === 'a') {
            console.log(JSON.stringify(diff))
        }
        if (diff.type === 'd') {
            // console.log(JSON.stringify(diff))
        }
        if (diff.type === 'm') {
            // console.log(JSON.stringify(diff))
        }
        if (diff.type === 'c') {
            // console.log(JSON.stringify(diff))
        }
    };

    turn = () => {
        this.setState(({data}) => {
            const turn = data.get('turn');
            const update = this.updates.get(turn);
            if (update === undefined) {
                this.pause();
            }
            const _data = data.withMutations(map => {
                const turn = map.get('turn');
                const update = this.updates.get(turn);
                if (update) {
                    update.diffs.forEach(diff => this.applyDiff(map, diff));
                    map.set('scores', update.scores);
                    map.set('turn', turn + 1);
                }
            });
            return {data: _data};
        });
    };

    render() {
        const {data} = this.state;
        const {w, h} = this.state.size;
        const turn = data.get('turn');
        const [score1, score2] = data.get('scores');
        return (
            <div className="container mt-4">
                <div className="row">
                    <div className="col text-center">
                        turn: {turn}
                    </div>
                    <div className="col">
                        <span className="text-danger">{score1}</span>
                        {' - '}
                        <span className="text-primary">{score2}</span>
                    </div>
                    <div className="col text-center">
                        <div className="btn-group">
                            <button className="btn btn-secondary" onClick={this.reset}>&laquo;</button>
                            <button className="btn btn-secondary" onClick={this.togglePlay}>&rsaquo;</button>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center mt-4">
                    <div className="col d-flex justify-content-center">
                        <Board w={w} h={h} data={data}/>
                    </div>
                </div>
            </div>
        );
    }
}