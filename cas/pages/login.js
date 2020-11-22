import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Logo from '../components/logo'
import {Component, createRef} from "react"
import axios from "axios";
import Head from 'next/head'
import Alert from 'react-bootstrap/Alert'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Router from 'next/router'
import PinInput from "react-pin-input";

class Login extends Component {

    static getInitialProps({ query: { service } }){
        return { 
            service: unescape(service) || false
        }
    }
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            stage: 'check_email',
            password: "",
            message: {text:'', variant:'danger'},
            processing: false,
            twofactor: '',
            fullName: "",
            phone: "",
            username: "",
            hcaptcha: "depracated",
            recaptchaRef : createRef(),
            service: props.service,
            schools:[
                "Ανωτάτη Σχολή Καλών Τεχνών (Α.Σ.Κ.Τ.)",
                "Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης (Α.Π.Θ.)",
                "Διεθνές Πανεπιστήμιο Ελλάδος",
                "Εθνικό Μετσόβιο Πολυτεχνείο (Ε.Μ.Π.)",
                "Ελληνικό Μεσογειακό Πανεπιστήμιο (ΕΛ.ΜΕ.ΠΑ.)",
                "Γεωπονικό Πανεπιστήμιο Αθηνών (Γ.Π.Α.)",
                "Εθνικό και Καποδιστριακό Πανεπιστήμιο Αθηνών (Ε.Κ.Π.Α.)",
                "Πανεπιστήμιο Δυτικής Αττικής (ΠΑ.Δ.Α.)",
                "Πανεπιστήμιο Πατρών",
                "Πανεπιστήμιο Κρήτης",
                "Πολυτεχνείο Κρήτης",
                "Πανεπιστήμιο Ιωαννίνων",
                "Δημοκρίτειο Πανεπιστήμιο Θράκης (Δ.Π.Θ.)",
                "Πανεπιστήμιο Θεσσαλίας",
                "Οικονομικό Πανεπιστήμιο Αθηνών (Ο.Π.Α.)",
                "Πάντειο Πανεπιστήμιο Κοινωνικών και Πολιτικών Επιστημών",
                "Πανεπιστήμιο Πειραιώς (ΠΑ.ΠΕΙ.)",
                "Πανεπιστήμιο Μακεδονίας (ΠΑ.ΜΑΚ.)",
                "Πανεπιστήμιο Δυτικής Μακεδονίας",
                "Πανεπιστήμιο Πελοποννήσου (ΠΑ.ΠΕΛ.)",
                "Πανεπιστήμιο Αιγαίου",
                "Ιόνιο Πανεπιστήμιο",
                "Χαροκόπειο Πανεπιστήμιο",
                "Ελληνικό Ανοικτό Πανεπιστήμιο (Ε.Α.Π.)",
                "Ανώτατη Σχολή Παιδαγωγικής και Τεχνολογικής Εκπαίδευσης (Α.Σ.ΠΑΙ.Τ.Ε.)",
                "Δευτεροβάθμια Εκπαίδευση (Γυμνάσιο/Λύκειο)",
                "ΙΕΚ",
                "Δεν φοιτώ σε κανένα ίδρυμα αυτήν τη στιγμή"
            ],
            school: "Ελληνικό Μεσογειακό Πανεπιστήμιο (ΕΛ.ΜΕ.ΠΑ.)",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTwoFactor = this.handleTwoFactor.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }

    handleTwoFactor(twofactor){
        this.setState({
            twofactor
        })

        if(twofactor.length == 5) this.handleSubmit(twofactor)
    }

    handleChange(key, event) {
        this.setState({
            [key]: event.target.value
        })
    }

    async resetPassword(event){  
        event.preventDefault()

        if(this.state.stage != "password_reset") this.setState({stage: "password_reset"})
        else if(!this.state.hcaptcha) this.setState({
                message: {
                    text: `Παρακαλούμε ολοκλήρωσε το captcha.`,
                    variant: "warning"
                },
                processing: false
            })
        else{    
            let captcha = this.state.hcaptcha

            this.setState({
                processing: true,
                message: {text:""}
            })

            let {email} = this.state
            await axios.post('../../api/resetPassword',{
                email,
                captcha
            })
            
            this.setState({
                stage: "login",
                processing:false,
                message:{
                    text: "Έχουμε στείλει ένα link επαναφοράς κωδικού στο mail σου. Αφού τελειώσεις την διαδικασία σε άλλο παράθυρο, επέστρεψε εδώ.",
                    variant: "success"
                }
            })
        }


    }

    async handleSubmit(event) {
        if(this.state.processing) return

        this.setState({
            processing: true,
            message: {text:""}
        })

        if(event.preventDefault) event.preventDefault()

        let ticket
        let captcha = this.state.hcaptcha

        const {stage, email, username, password, service, fullName, phone, school, twofactor} = this.state;

        switch(stage){
            case "register":
                let self = this 

                self.setState({
                    processing: true
                })

                if(!captcha){
                    this.setState({
                        message: {
                            text: `Παρακαλούμε ολοκλήρωσε το captcha.`,
                            variant: "warning"
                        },
                        processing: false
                    })

                    return
                }
    
                await axios.post('../../api/register',{
                    email,
                    fullName,
                    phone,
                    school,
                    captcha,
                    password,
                    username
                })
                .then(()=> 
                    self.setState({
                        message: {
                            text: `Τέλεια! Σου έχουμε στείλει ένα email που περιέχει ένα σύνδεσμο ενεργοποίησης λογαριασμού. Μόλις ολοκληρώσεις την διαδικασία, δοκίμασε να συνδεθείς πάλι σε αυτό το παράθυρο.`,
                            variant: "success"
                        },
                        processing: false,
                        stage: "check_email",
                        password: ""
                    })
                )
                .catch(e=>{
                    self.setState({
                        message: {
                            text: e.response.data,
                            variant: "warning"
                        },
                        processing: false,
                    })
                })
            break
            case "check_email":
                let {data:{emailExists, pendingActivation}} = await axios
                    .post('../../api/emailExists',{
                        email: email
                    })
                
                this.setState({
                    stage: emailExists ? "login" : "register",
                    message: pendingActivation ? {
                        text: "Έχεις ήδη υποβάλει αίτημα εγγραφής και εκκρεμεί η ενεργοποίηση του λογαριασμού σου. Αν ξανα-υποβάλεις εγγραφή, η προηγούμενη προσπάθεια θα ακυρωθεί.",
                        variant: "warning"
                    } : {}
                })
            break
            case "login":
                if(!captcha){
                    this.setState({
                        message: {
                            text: `Παρακαλούμε ολοκλήρωσε το captcha.`,
                            variant: "warning"
                        },
                        processing: false
                    })

                    return
                }
                //console.log(captcha)
                try{
                const {data:{ticket, requiresTwoFactor}} = await axios
                    .post('../../api/login',{
                        email,
                        password,
                        service,
                        captcha
                    })
                if(!requiresTwoFactor && ticket){
                    this.setState({
                        message: {
                            text: `Επιτυχής είσοδος! Ανακατεύθυνση σε ${this.props.service}...`,
                            variant: "success"
                        }
                    })
                    
                    Router.push(`${service}?ticket=${ticket}`)
                }else this.setState({
                        stage: "twofactor"
                    })
                }catch(e){
                    this.setState({
                        processing: false,
                        message: {
                            text: "Λάθος κωδικός πρόσβασης ή μη επιτρεπτή χρήση (401).",
                            variant: "danger"
                        }
                    })
                }
            break
            case "twofactor":
                    try {
                        const {data:{ticket}} = await axios
                        .post('../../api/login',{
                            email,
                            password,
                            service,
                            twofactor: event,
                        })
                        if(ticket){
                            this.setState({
                                message: {
                                    text: `Επιτυχής είσοδος! Ανακατεύθυνση σε ${this.props.service}...`,
                                    variant: "success"
                                }
                            })
                            
                            Router.push(`${service}?ticket=${ticket}`)
                        }
                    } catch (error) {
                        this.setState({
                            stage: "check_email",
                            message: {
                                text: `Λάθος κωδικός επαλήθευσης. Η προσπάθεια εισόδου ακυρώθηκε. Προσπάθησε πάλι.`,
                                variant: "danger"
                            }
                        }) 
                    }

            break
        }

        this.setState({
            processing: false
        })
    }

    render() {
        let error
        if(!this.props.service) error = "GET parameter \"service\" is empty."
        
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
                {this.state.stage != "check_email" ? (<a href="#" className="goBack" onClick={()=>{ this.setState({stage: 'check_email'})}}><i className="fas fa-arrow-left"></i> Πίσω</a>) : false}

                    {
                        {
                            check_email: (
                                <Form className="login email row" onSubmit={this.handleSubmit} >
                                    <p className="col-9"><i className="fas fa-user"></i> Καλωσήρθες στο κεντρικό σύστημα ταυτοποίησης (CAS) του po/iw.</p>
                                    <div className="col-12 col-md-8">
                                        <Form.Group>
                                            <Form.Control type="email" value={this.state.email} onChange={this.handleChange.bind(this, 'email')} placeholder="Διεύθυνση Email" required/>
                                        </Form.Group>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        {!this.state.processing ? (
                                            <Button className="btn" variant="primary" type="submit">
                                                Επόμενο
                                            </Button>  
                                        ):false}              
                                    </div>
                                    <div className="col-12">
                                        <p style={{marginTop: 40 + 'px'}}>
                                            <u><b>Εισάγετε το email σας και πατήστε επόμενο.</b></u><br/>Αν δεν έχεις λογαριασμό στο po/iw, τότε θα σου ζητηθεί να δημιουργήσεις έναν καινούριο.
                                        </p>
                                    </div>
                                </Form>
                            ),
                            login: (
                                <Form className="login password row" onSubmit={this.handleSubmit}>
                                    <p className="col-9"><i className="fas fa-lock"></i> Πληκτρολόγησε τον κωδικό πρόσβασής σου στο po/iw.</p>
                                    <div className="col-12 col-md-9">
                                        <Form.Group>
                                            <Form.Control type="password" value={this.state.password} onChange={this.handleChange.bind(this, 'password')} placeholder="Κωδικός Πρόσβασης" required/>
                                        </Form.Group>
                                    </div>
                                    <div className="col-12 col-xl-4">
                                    </div>
                                    <div className="col-12 col-md-4">
                                        {!this.state.processing ? (
                                            <Button className="btn" variant="primary" type="submit">
                                                Είσοδος
                                            </Button>  
                                        ):false}                    
                                    </div>
                                    <div className="col-12"> 
                                        <p style={{marginTop: 40 + 'px'}}>
                                            <u><b>Ξέχασες τον κωδικό πρόσβασης;</b></u> <a href="#" onClick={this.resetPassword}>Επαναφορά κωδικού πρόσβασης</a>
                                        </p>
                                    </div>
                                </Form>
                            ),
                            password_reset: (
                                <Form className="login password row" onSubmit={this.handleSubmit}>
                                    <p className="col-9"><i className="fas fa-user"></i> Θέλεις σίγουρα να ζητήσεις επαναφορά κωδικού;</p>
                                    <div className="col-12 col-xl-4">
                                    </div>
                                    <div className="col-12 col-md-4">
                                        {!this.state.processing ? (
                                            <Button className="btn" variant="primary" onClick={this.resetPassword}>
                                                Ναι
                                            </Button>  
                                        ):false}                    
                                    </div>
                                </Form>
                            ),
                            register: (
                                <Form className="register row" onSubmit={this.handleSubmit}>
                                    <p className="col-9"><i className="fas fa-lock"></i> Τρομερό! Φαίνεται ότι δεν είσαι μέλος στο po/iw! <b>Φτιάξε έναν λογαριασμό εδώ:</b></p>
                                    <div className="col-12">
                                        <Form.Group className="row">
                                            <Form.Control type="text" className="col-12 col-md-5" value={this.state.fullName} onChange={this.handleChange.bind(this, 'fullName')} placeholder="Ονοματεπώνυμο" required/>
                                            <Form.Control type="text" className="col-12 col-md-5" value={this.state.username} onChange={this.handleChange.bind(this, 'username')} placeholder="Username" required/>
                                            <Form.Control type="text" className="col-12 col-md-5" value={this.state.phone} onChange={this.handleChange.bind(this, 'phone')} placeholder="Τηλ. Επικοινωνίας" required/>
                                            <Form.Control type="password" className="col-12 col-md-5" value={this.state.password} onChange={this.handleChange.bind(this, 'password')} placeholder="Κωδικός πρόσβασης" required/>
                                            <label className="col-12 p-2">Ίδρυμα φοίτησης:</label>
                                            <Form.Control as="select" size="md" value={this.state.school} className="col-12 col-md-8 schoolSelector" onChange={this.handleChange.bind(this, 'school')}>
                                                {this.state.schools.map(school=>{
                                                    return(
                                                        <option>{school}</option>
                                                    )
                                                })}
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className="col-12 col-xl-4">
                                    </div>
                                    <div className="col-12">
                                        {!this.state.processing ? (
                                            <Button className="btn" variant="primary" type="submit">
                                                Εγγραφή 
                                            </Button>                   
                                        ): false}
                                    </div>
                                </Form>
                            ),
                            twofactor: (
                                <Form className="login password row" onSubmit={this.handleSubmit}>
                                    <p className="col-9"><i className="fas fa-lock"></i> Πληκτρολόγησε τον 5-ψήφιο κωδικό επαλήθευσης που έχουμε στείλει στο email σου.</p>
                                    <div className="col-12 col-md-8">
                                    <PinInput
                                        length={5}
                                        focus
                                        // disabled
                                        ref={p => (this.state.twofactor = p)}
                                        type="numeric"
                                        onChange={e => (this.handleTwoFactor(e))}
                                        />
                                    </div>
                                    <div className="col-12"> 
                                        <p style={{marginTop: 40 + 'px'}}>
                                            Το βήμα αυτό μας βοηθά να κρατήσουμε τον λογαριασμό σου ασφαλή. Αν αντιμετωπίσεις κάποιο πρόβλημα, επικοινώνησε με την ομάδα.
                                        </p>
                                    </div>
                                </Form>
                            )
                            
                        }[this.state.stage]
                    }
                    <Logo></Logo>
                </div>
            </div>
        )
  }
}
  
export default Login;
