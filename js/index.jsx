let ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


var App = React.createClass({
	getInitialState() {
		return {
			status: 2
		}
	},
	changeStatus(i) {
		this.setState({
			status: i
		});
	},
	render() {
		return (
			<div>
				<header><h1>Twitch Streamers</h1></header>
				<Tabs status = {this.changeStatus} />
				<Cards status = {this.state.status} />
			</div>
		);
	}
});

const Tabs = React.createClass({
	getInitialState() {
		return {
			style: 3,
			blue: {
				color:  "#2196F3"
			},
			white: {
				color: "rgba(0, 0, 0, 0.5)"
			}
		};
	},
	changeColor() {
		this.props.status(0); //Calling Change Status
		this.setState({
			style: 1
		});
	},
	changeColorSecond() {
		this.props.status(1); //Calling Change Status
		this.setState({
			style: 2
		});
	},
	changeColorThird() {
		this.props.status(2); //Calling Change Status
		this.setState({
			style: 3
		});
	},
	render() {
		return (
			<div id="tabs">
				{ this.state.style === 1 ? <p onClick={this.changeColor} style={{color: this.state.blue.color}} >Online</p> : <p onClick={this.changeColor}>Online</p>}
				{ this.state.style === 2 ? <p onClick={this.changeColorSecond} style={{color: this.state.blue.color}} >Offline</p> : <p onClick={this.changeColorSecond}>Offline</p>}
				{ this.state.style === 3 ? <p onClick={this.changeColorThird} style={{color: this.state.blue.color}} >All</p> : <p onClick={this.changeColorThird}>All</p>}
			</div>	
		)
	}
});

const Cards = React.createClass({
	getInitialState() {
		return {
			renderAll: [],
			renderOnline: [],
			renderOffline: [],
			renderClosed: [],
			check: this.props.status,
			channels:  ["freecodecamp", "storbeck", "habathcx","meteos","RobotCaleb","noobs2ninjas","brunofin","comster404","cretetion","sheevergaming","TR7K","OgamingSC2","ESL_SC2"]
		};
	},
	getData(last) {
		if(last === undefined) {
			for(let i =0; i<this.state.channels.length;i++) {
				let channel = this.state.channels[i];
				$.getJSON("https://api.twitch.tv/kraken/streams/" + channel, (data) => {
					$.getJSON("https://api.twitch.tv/kraken/channels/" + channel, (logo) => {
						if(data.hasOwnProperty(status) === false) {
							if(data.stream === null) {
								this.setState({
									renderAll: this.state.renderAll.concat([{channel: channel, url: `https://www.twitch.tv/${channel}`, status: 'offline', logo: logo.logo}]),
									renderOffline: this.state.renderOffline.concat([{channel: channel, url: `https://www.twitch.tv/${channel}`, status: 'offline', logo: logo.logo}])
								});
							} else {
								this.setState({
									renderAll: this.state.renderAll.concat([{channel: data.stream.channel.name, url: `https://www.twitch.tv/${channel}`, current: data.stream.channel.game + ' - ' + data.stream.channel.status, status: 'online', logo: logo.logo}]),
									renderOnline: this.state.renderOnline.concat([{channel: data.stream.channel.name, url: `https://www.twitch.tv/${channel}`, current: data.stream.channel.game + ' - ' + data.stream.channel.status, status: 'online', logo: logo.logo}])
								});
							}
						}
					});
				})	
				.fail((jqxhr) => {
					this.setState({
						renderClosed: this.state.renderClosed.concat([{channel: channel, status: 'closed'}])
					});
				});
			}
		} else {
			let channel = this.state.channels[this.state.channels.length - 1];
			$.getJSON("https://api.twitch.tv/kraken/streams/" + channel, (data) => {
				$.getJSON("https://api.twitch.tv/kraken/channels/" + channel, (logo) => {
					if(data.hasOwnProperty(status) === false) {
						if(data.stream === null) {
							this.setState({
								renderAll: this.state.renderAll.concat([{channel: channel, url: `https://www.twitch.tv/${channel}`, status: 'offline', logo: logo.logo}]),
								renderOffline: this.state.renderOffline.concat([{channel: channel, url: `https://www.twitch.tv/${channel}`, status: 'offline', logo: logo.logo}])
							});
						} else {
							this.setState({
								renderAll: this.state.renderAll.concat([{channel: data.stream.channel.name, url: `https://www.twitch.tv/${channel}`, current: data.stream.channel.game + ' - ' + data.stream.channel.status, status: 'online', logo: logo.logo}]),
								renderOnline: this.state.renderOnline.concat([{channel: data.stream.channel.name, url: `https://www.twitch.tv/${channel}`, current: data.stream.channel.game + ' - ' + data.stream.channel.status, status: 'online', logo: logo.logo}])
							});
						}
					}
				});
			})	
			.fail((jqxhr) => {
				this.setState({
					renderClosed: this.state.renderClosed.concat([{channel: channel, status: 'closed'}])
				});
			});
		}

	},
	componentWillMount() {
		this.getData();
	},
	componentWillReceiveProps(prop) {
		this.setState({
			check: prop
		});
	},
	renderCards(i) {
		if(i === 0 || i.status === 0) {
			let cards = this.state.renderOnline.map((item, i) => {
				return <div className="online cards" key={i}><img src={item.logo} width="30px" height="30px" /><a target="_blank" href={item.url}><h3>{item.channel}</h3></a><p>{item.current}</p></div>
			});
			return (
				cards
			)
		} else if(i === 1 || i.status === 1) {
			let cards = this.state.renderOffline.map((item, i) => {
				if(item.status === 'offline') {
					return <div className="offline cards" key={i}><img src={item.logo} width="30px" height="30px"/><a target="_blank" href={item.url}><h3>{item.channel}</h3></a><p>Channel is offline</p></div>
				}
			});
			return (
				cards
			)
		} else if(i === 2 || i.status === 2) {
			let cards = this.state.renderAll.map((item, i) => {
				if(item.status === 'offline') {
					return <div className="offline cards" key={i}><img src={item.logo} width="30px" height="30px" /><a target="_blank" href={item.url}><h3>{item.channel}</h3></a><p>Channel is offline</p></div>
				} else {
					return <div className="online cards" key={i}><img src={item.logo} width="30px" height="30px" /><a target="_blank" href={item.url}><h3>{item.channel}</h3></a><p>{item.current}</p></div>
				}
			});
			let closed = this.state.renderClosed.map((item, i) => {
				return <div className="closed cards" key={i}><h3>{item.channel}</h3><p>Account Closed</p></div>
			});
			cards.push(closed);
			return (
				cards
			)
		}
	},
	newChannel(i) {
		if(i.keyCode === 13) {
			this.setState({channels: this.state.channels.concat([i.target.value])}, function() {
				this.getData(1);
			});
		}
	},
	leave(i) {
		i.target.value = '';
	},
	render() {
		return (
			<div id="cards-inside">
				<input type='text' placeholder="+ Channel" onKeyDown={this.newChannel} onBlur={this.leave}/>
				<ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          			{this.renderCards(this.state.check)}
       			</ReactCSSTransitionGroup>
			</div>	
		)
	}
});

ReactDOM.render(<App />, document.getElementById("container-second"));