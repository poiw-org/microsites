import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Logo from '../components/logo'
import { Component } from "react"
import axios from "axios";
import Head from 'next/head'
import Alert from 'react-bootstrap/Alert'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Router from 'next/router'

class Login extends Component {

    static getInitialProps({ query: { t } }){
        return { 
            t: unescape(t) || false
        }
    }
    constructor(props) {
        super(props)

        this.state = {
            passwordReset: false,
            password: "",
            message: {text:'', variant:'danger'},
            processing: false,
            token: props.t,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(key, event) {
        this.setState({
            [key]: event.target.value
        })
    }

    async handleSubmit(event) {
        event.preventDefault()

        let self = this
        this.setState({
            processing: true
        })

        await axios.post("../../api/resetPassword",{
            token: this.state.token,
            password: this.state.password
        }).then(res=>{
            self.setState({
                processing:false,
                passwordReset: true,
                message:{}
            })
        })
        .catch({
            message:{
                text: "Σφάλμα. Παρακαλώ κάντε την διαδικασία από την αρχή.",
                variant: "danger"
            }
        })
    }

    render() {
        let error        
        if(error) return(
            <div className="container p-4">
                <h1>Σφάλμα:</h1>
                <h3>{error}</h3>
                <Logo></Logo>
            </div>
        )

        return(
            <div>
                {this.state.message.text ? (
                    <Alert variant={this.state.message.variant} style={{borderRadius: 0}}>
                        {this.state.message.text}
                    </Alert>
                ):false}

                {this.state.processing ? (
                    <ProgressBar animated now={100} style={{borderRadius: 0}}/>
                ):false} 

                <div className="container">
                    <Head>
                        <title>po/iw CAS</title>
                        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    </Head>

                    { !this.state.passwordReset ? (
                    <Form className="login password row" onSubmit={this.handleSubmit}>
                        <p className="col-9"><i className="fas fa-lock"></i> Εισάγετε τον <b>νεό</b> κωδικό πρόσβασής σας στο po/iw.</p>
                        <div className="col-12 col-md-8">
                            <Form.Group>
                                <Form.Control type="password" value={this.state.password} onChange={this.handleChange.bind(this, 'password')} placeholder="Κωδικός Πρόσβασης" required/>
                            </Form.Group>
                        </div>
                        <div className="col-12 col-md-4">
                            {!this.state.processing ? (
                                <Button className="btn" variant="primary" type="submit">
                                    Υποβολή
                                </Button>  
                            ):false}                    
                        </div>
                    </Form>
                    ):(
                        <div className="container login">
                            <h3>Ο κωδικός σου άλλαξε.</h3>
                            <p>Μπορείς πλέον να συνδεθείς με τον νέο σου κωδικό. Αν συνεχίζεις να αντιμετωπίζεις προβλήματα, επικοινώνησε με την ομάδα.</p>
                        </div>
                    )}
                    <Logo></Logo>
                </div>
            </div>
        )
  }
}
  
export default Login;