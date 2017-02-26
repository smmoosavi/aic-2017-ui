import React, {Component} from 'react';
import './App.css';
import Player from './views/Player';
import FileInput from './views/FileInput';


class App extends Component {
    constructor(...args) {
        super(...args);
        this.state = {data: null};
    };

    setData = (data) => {
        this.setState({data});
    };

    render() {

        if (this.state.data) {
            return <Player data={this.state.data}/>;
        }
        return <FileInput logUrl={window.logUrl} setData={this.setData}/>;
    }
}

export default App;
