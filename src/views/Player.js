import React, {Component} from 'react';
import Immutable from 'immutable';
import cx from 'classnames';

class Floor extends Component {
    render() {
        const {x, y}= this.props;
        const style = {
            left: 64 * y,
            top: 64 * x,

        };
        return <div className="floor" style={style}></div>
    }
}

class Bug extends Component {
    render() {
        const {data}= this.props;
        const {x, y, direction, color, queen, sick, team} = data.toJS();
        const style = {
            left: 64 * y,
            top: 64 * x,

        };
        const dir = ['to-right', 'to-up', 'to-left', 'to-down'][direction];

        const className = cx("bug", color ? 'up' : 'down', 'team' + team, {sick, queen}, dir);
        return <div className={className} style={style}></div>;
    }
}

class Food extends Component {
    render() {
        const {data}= this.props;
        const {x, y} = data.toJS();
        const style = {
            left: 64 * y,
            top: 64 * x,

        };
        return <div className="food" style={style}></div>;
    }
}

class Trash extends Component {
    render() {
        const {data}= this.props;
        const {x, y} = data.toJS();
        const style = {
            left: 64 * y,
            top: 64 * x,

        };
        return <div className="trash" style={style}></div>;
    }
}


class Net extends Component {
    render() {
        const {data, w, h, dx, dy}= this.props;
        const {x, y} = data.toJS();
        const _x = (w + x + dx) % w;
        const _y = (h + y + dy) % h;
        const style = {
            left: 64 * _y,
            top: 64 * _x,

        };
        return <div className="net" style={style}></div>;
    }
}


class Teleport extends Component {
    render() {
        const {data}= this.props;
        const {x, y} = data.toJS();
        const style = {
            left: 64 * y,
            top: 64 * x,

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

        const teleports = data.get('teleports');
        teleports.forEach((teleport) => {
            const id = teleport.get('id');
            children.push(<Teleport data={teleport} key={`Fo-${id}`}/>);
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

        bees.forEach((bee) => {
            const id = bee.get('id');
            children.push(<Bug data={bee} key={`Be-${id}`}/>);
        });

        const nets = data.get('nets');
        nets.forEach((net) => {
            const id = net.get('id');
            children.push(<Net w={w} h={h} dx={1} dy={1} data={net} key={`Fo-${id}-1`}/>);
            children.push(<Net w={w} h={h} dx={1} dy={0} data={net} key={`Fo-${id}-2`}/>);
            children.push(<Net w={w} h={h} dx={1} dy={-1} data={net} key={`Fo-${id}-3`}/>);

            children.push(<Net w={w} h={h} dx={0} dy={1} data={net} key={`Fo-${id}-4`}/>);
            children.push(<Net w={w} h={h} dx={0} dy={0} data={net} key={`Fo-${id}-5`}/>);
            children.push(<Net w={w} h={h} dx={0} dy={-1} data={net} key={`Fo-${id}-6`}/>);

            children.push(<Net w={w} h={h} dx={-1} dy={1} data={net} key={`Fo-${id}-7`}/>);
            children.push(<Net w={w} h={h} dx={-1} dy={0} data={net} key={`Fo-${id}-8`}/>);
            children.push(<Net w={w} h={h} dx={-1} dy={-1} data={net} key={`Fo-${id}-9`}/>);
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
    const [, w, h, bees, foods, trashes, nets, teleports] = init.args;
    const beeMap = Immutable.Map(bees.map(convertBee).map(bee => [bee.get('id'), bee]));
    const foodMap = Immutable.Map(foods.map(convertFood).map(food => [food.get('id'), food]));
    const trashMap = Immutable.Map(trashes.map(convertTrash).map(trash => [trash.get('id'), trash]));
    const netMap = Immutable.Map(nets.map(convertNet).map(net => [net.get('id'), net]));
    const teleportMap = Immutable.Map(teleports.map(convertTeleport).map(teleport => [teleport.get('id'), teleport]));
    return Immutable.Map({
        size: [w, h],
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


    applyAdds = (map, diff) => {
        diff.args.forEach((arg) => this.applyAdd(map, arg));
    };
    applyAdd = (map, diff) => {
        const [id, type, x, y, direction, color, queen, team] = diff;
        if (type === 0) {
            const sick = 0;
            const bee = Immutable.Map({id, x, y, direction, color, queen, sick, team});
            map.setIn(['bees', id], bee);
        }
        if (type === 1) {
            const food = Immutable.Map({id, x, y});
            map.setIn(['foods', id], food);
        }
        if (type === 2) {
            const trash = Immutable.Map({id, x, y});
            map.setIn(['trashes', id], trash);
        }
        if (type === 3) {
            const net = Immutable.Map({id, x, y});
            map.setIn(['nets', id], net);
        }
    };
    applyMoves = (map, diff) => {
        diff.args.forEach((arg) => this.applyMove(map, arg));
    };
    applyMove = (map, diff) => {
        const [w, h] = map.get('size');
        const directionY = [1, 0, h - 1, 0];
        const directionX = [0, w - 1, 0, 1];
        const [id, m] = diff;
        if (m === 0) {// turn right
            map.updateIn(['bees', id, 'direction'], d => (d + 1) % 4);
        }
        if (m === 2) {// turn left
            map.updateIn(['bees', id, 'direction'], d => (d + 3) % 4);
        }
        if (m === 1) {// move
            const d = map.getIn(['bees', id, 'direction']);
            map.updateIn(['bees', id, 'x'], x => (x + directionX[d]) % w);
            map.updateIn(['bees', id, 'y'], y => (y + directionY[d]) % h);
        }
    };
    applyChanges = (map, diff) => {
        diff.args.forEach((arg) => this.applyChange(map, arg));
    };
    applyChange = (map, arg) => {
        const [id, x, y, color, sick] = arg;
        map.setIn(['bees', id, 'x'], x);
        map.setIn(['bees', id, 'y'], y);
        map.setIn(['bees', id, 'color'], color);
        map.setIn(['bees', id, 'sick'], sick);
    };

    applyDelete = (map, diff) => {
        diff.args.forEach((ids) => {
            ids.forEach(id => {
                map.deleteIn(['bees', id]);
                map.deleteIn(['foods', id]);
                map.deleteIn(['trashes', id]);
                map.deleteIn(['nets', id]);
                map.deleteIn(['teleports', id]);
            });
        });
    };

    applyDiff = (map, diff) => {
        if (diff.type === 'a') {
            this.applyAdds(map, diff);
        }
        if (diff.type === 'd') {
            this.applyDelete(map, diff);
        }
        if (diff.type === 'm') {
            this.applyMoves(map, diff);
        }
        if (diff.type === 'c') {
            this.applyChanges(map, diff);
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
        const [score0, score1] = data.get('scores');
        return (
            <div className="container mt-4">
                <div className="row">
                    <div className="col text-center">
                        turn: {turn}
                    </div>
                    <div className="col">
                        <div className="row">
                            <span className="col-6 text-center">{window.team0name}</span>
                            <span className="col-6 text-center">{window.team1name}</span>
                        </div>
                        <div className="row">
                            <span className="col-6 text-center text-primary">{score0}</span>
                            <span className="col-6 text-center text-danger">{score1}</span>
                        </div>
                    </div>
                    <div className="col text-center">
                        <div className="btn-group">
                            <button className="btn btn-secondary" onClick={this.reset}>&laquo;</button>
                            <button className="btn btn-secondary" onClick={this.togglePlay}>&rsaquo;</button>
                            <button className="btn btn-secondary" onClick={this.turn}>&rsaquo;</button>
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