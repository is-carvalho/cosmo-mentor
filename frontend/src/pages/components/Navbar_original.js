import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import '../../css/Navbar.css';
import logo from '../../images/tipografia black.png'
import notifications from '../../images/icons8-notification-30.png'
import api from "../../services/api";


class Navbar extends Component {
	constructor() {
		super()

		this.state = {
			nome: '',
			foto: '',
			classeProfile: 'profile_dd',
			classeMenuSidebar: 'hamburger',
			classeNotification: 'notification_off',
			results: [],
			currentAuthors: [],
			notifications: []
		}

		this.btnProfileClicked = this.btnProfileClicked.bind(this);
		this.btnNotificationsClicked = this.btnNotificationsClicked.bind(this);
	}

	getUserId() {
		const token = localStorage.usertoken;
		const decoded = jwt_decode(token);
		return decoded.id;
	}

	getUserName() {
		const token = localStorage.usertoken
		const decoded = jwt_decode(token)
		return decoded.nome
	}

	getUserPhoto() {
		const items = JSON.parse(localStorage.getItem('items'));
		return items
	}

	logout(e) {
		e.preventDefault()
		localStorage.removeItem('usertoken')
		this.props.history.push('/')
	}

	btnProfileClicked(e) {
		if (this.state.classeProfile === 'profile_dd active') {
			this.setState({
				classeProfile: "profile_dd"
			})
		} else {
			this.setState({
				classeProfile: "profile_dd active"
			})
		}
	}

	btnNotificationsClicked(e) {
		if (this.state.classeNotification === 'notification_off') {
			this.setState({
				classeNotification: "notification_on"
			})
		} else {
			this.setState({
				classeNotification: "notification_off"
			})
		}
	}

	componentDidMount() {
		const local = this.props.location;
		const baseName = local.pathname.split('/').pop()
		switch (baseName) {
			case 'menu':
			case 'cursos':
			case 'turmas':
			case 'forum':
				break
			default:
				this.setState({ classeMenuSidebar: 'hamburger-closed' })
				break
		}

		this.getNotifications()
	}

	componentDidUpdate() {
		this.setState({
			notifications: this.notify()
		})
		console.log(this.state.notifications)
	}

	notify() { // Organiza os dados de cada notificação para o frontend
		const userNotifications = []
		// console.log(this.state.results)

		for(let i = 0; i < this.state.results.length; i++) {
			console.log(this.state.currentAuthors)
			this.getAuthors(this.state.results[i].entityID)
			switch(this.state.results[i].type) {
				case 'reply':

					if(this.state.currentAuthors.length > 2) {
						const name1 = this.state.currentAuthors[0].nome
						const name2 = this.state.currentAuthors[1].nome
						const total = this.state.currentAuthors.length - 2

						userNotifications.push({
							notificationID: this.state.results[i].notificationID,
							text: `${name1}, ${name2} e outros ${total} responderam a sua pergunta!`
						})
					} else if(this.state.currentAuthors.length === 2) {
						const name1 = this.state.currentAuthors[0].nome
						const name2 = this.state.currentAuthors[1].nome

						userNotifications.push({
							notificationID: this.state.results[i].notificationID,
							text: `${name1} e ${name2} responderam a sua pergunta!`
						})
					} else {
						const name1 = this.state.currentAuthors[0].nome

						userNotifications.push({
							notificationID: this.state.results[i].notificationID,
							text: `${name1} respondeu a sua pergunta!`
						})
					}
					
					break;
					
				case '': // Outros tipos de notificação
					break;
			}
		}
		return userNotifications
	}

	getNotifications() { // busca as notificações do usuário no BD
        api.get('/userNotifications', {
            headers: {
                userId: this.getUserId()
            }
        }).then(res => {
			this.setState({
				results: res.data.data
			})
        })
    }

	getAuthors(entityId) {
		api.get('/userReplies', {
			headers: {
				entityID: entityId
			}
		})
		.then(res => {
			this.setState({
				currentAuthors: res.data.data
			})
		})
	}

	render() {
		const userName = this.getUserName()
		const foto = this.getUserPhoto()

		return (
			<div className="top_navbar">
				<div className={this.state.classeMenuSidebar}>
					<div className="hamburger__inner">
						<div className="one"></div>
						<div className="two"></div>
						<div className="three"></div>
					</div>
				</div>
				<div className="menu">
					<div className="logo">
						<Link to="/menu">
							<img alt="Cosmo logo" src={logo} className="logo" />
						</Link>
					</div>
					<div className="imgNotification" onClick={this.btnNotificationsClicked}>
						<img src={notifications} style={{ cursor: "pointer" }}></img>
						<div className={this.state.classeNotification}>
							<ul className="nav navbar-nav">
								<li>

								</li>
							</ul>
						</div>
					</div>
					<div className="right_menu">
						<ul className="nav navbar-nav">
							<li>
								<a className="link-menu" style={{ cursor: "pointer" }}>
									<img src={foto} alt="foto" style={{ borderRadius: 50, height: 50, width: 50, margin: 10 }} onClick={this.btnProfileClicked} />
								</a>
								<div className={this.state.classeProfile}>
									<div className="profile">
										<div className="img">
											{(foto) ? <img src={foto} alt="profile_pic" referrerPolicy="no-referrer" /> : <></>}
										</div>
										<p>{userName}</p>
									</div>

									<div className="dropdown-divider"></div>

									<a href="/profile" className="dd_item dropdown-item">
										<i className="fas fa-eye"></i> Ver Perfil
									</a>
									<div className="dropdown-divider"></div>
									<a className="dd_item dropdown-item" href=" " onClick={this.logout.bind(this)}>
										<i className="fas fa-power-off"></i> Sair
									</a>
									<div className="dropdown-divider"></div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		)
	}
}

export default withRouter(Navbar)


