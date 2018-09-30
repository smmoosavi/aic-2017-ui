import React, {Component} from 'react';

const parseData = (str) => {
    let error = false;
    let data = null;
    try {
        const _data = str.split('\0').filter(s => s).map(s => JSON.parse(s));
        const [init, ...updates] = _data;
        data = {init, updates};
        if (init.name !== 'init') {
            error = true;
            data = null;
        }
    } catch (e) {
        error = true;
    }
    return {error, data};
};

export default class FileInput extends Component {
    constructor(...args) {
        super(...args);
        this.state = {error: false};
    };

    onChange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const {error, data} = parseData(e.target.result);
            this.setState({error});
            this.props.setData(data);
        };
        reader.readAsText(file);
    };

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        if (this.props.logUrl) {
            window.fetch(this.props.logUrl)
                .then((r) => r.text())
                .then((str) => {
                    const {error, data} = parseData(str);
                    this.setState({error});
                    this.props.setData(data);
                });
        }
    };

    render() {
        const showInput = !this.props.logUrl;
        return (
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="col col-md-6">
                        <div className="card mt-4">
                            <div className="card-body">
                                {this.state.error && <div className="alert alert-danger">Invalid file</div>}
                                {showInput && <input type="file" onChange={this.onChange}/>}
                                {!showInput && <div className="text-center">loading</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
