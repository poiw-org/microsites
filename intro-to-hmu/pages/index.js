import Logo from '../components/logo'
import {InputGroup, FormControl, Button, Alert, ProgressBar, Modal} from 'react-bootstrap'
import {Component, createRef} from "react"
import Head from 'next/head'
import axios from 'axios'
import ReCAPTCHA from "react-google-recaptcha";

class Event extends Component {

    static getInitialProps({ query: { verified } }){
        return { 
            verified: verified || false
        }
    }
    constructor(props) {
        super(props)

        this.state = {
          registered: process.browser ? (localStorage.getItem('registered') || false) : false,
          email: '',
          recaptchaRef: createRef(),
          message: props.verified ? {
            text: 'Η εγγραφή σου ήταν επιτυχής! Σε ευχαριστούμε για το ενδιαφέρον σου. Θα σου στείλουμε οδηγίες για το πως να συμμετέχεις σύντομα.',
            variant: 'success'
          } : {
            text : '',
            variant: ''
          }
        };

        this.submitRegistration = this.submitRegistration.bind(this);
    }

    handleChange(key, event) {
        this.setState({
            [key]: event.target.value
        })
    }

    async submitRegistration(event) {
        if(this.state.processing) return
        let self = this

        this.setState({
            processing: true,
            message: {text:""}
        })

        if(event.preventDefault) event.preventDefault()
        window.scrollTo(0, 0); 

        await this.state.recaptchaRef.current.reset()
        recaptcha = await this.state.recaptchaRef.current.executeAsync();

        await axios
          .post('../../api/register', {
            email: this.state.email,recaptcha
          })
          .catch(e=>{
            self.setState({
              message:{
                text: e.response.data,
                variant: 'danger'
              }
            })
          })

        window.scrollTo(0, 0); 
        this.setState({
            processing: false,
        })
    }

    render() {
        return(
            <div>
                <ReCAPTCHA
                  sitekey="6Lcp39IZAAAAAFZSr3LpnErH1UTVcYL4SjeZVUx4"
                  size="invisible"
                  ref={this.state.recaptchaRef}
                />

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
                        <title>po/iw event</title>
                        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    </Head>
                    <div className="container text-left d-flex justify-content-between flex-column">
                    <h3 className="logo-fp">po/iw:</h3>
                    <h2>Παρουσίαση του τμήματος Η.Μ.Μ.Υ. του Ελληνικού Μεσογειακού Πανεπιστημίου.</h2>

                    <Alert variant="primary">
                      Αυτό το event θα γίνει διαδικτυακά, ενώ δεν έχει οριστεί ακόμη ημέρα και ώρα.
                    </Alert>

                    <span className="p-4"></span>
                    <h4>ℹ️ Περιγραφή</h4>
                    <p><b>Κάλλιο αργά παρά ποτέ!</b> Η ομάδα μας φέτος, κατανοώντας την τρέχουσα κατάσταση με τον COVID-19, αποφάσισε να κάνει μια μικρή παρουσίαση του τμήματος στους νεοεισαχθέντες φοιτητές και φοιτήτριες, να τους εξηγήσει τα "διαδικαστικά" του να φοιτάς σε πανεπιστήμιο καθώς και να προσπαθήσει να απαντήσει σε μερικές απορίες που μπορεί να τους έχουν δημιουργηθεί.</p>
                    <span className="p-4"></span>

                    <div className="row">
                    <h4 className="col-12">✍️ Εγγραφή στην εκδήλωση</h4>
                    <span className="p-2 col-12"></span>
                    {this.state.registered ? 'Έχεις ήδη γραφτεί' : (
                      <div className="col-12 row">
                        <InputGroup className="col-12 col-md-9 col-xl-4">
                          <FormControl
                            placeholder="AM (π.χ. th1234)"
                            aria-label="AM (π.χ. th1234)"
                            aria-describedby="hmu-email"
                            max="6"
                            onChange={this.handleChange.bind(this, 'email')}
                          />
                          <InputGroup.Append>
                            <InputGroup.Text id="hmu-email">@edu.hmu.gr</InputGroup.Text>
                          </InputGroup.Append>
                        </InputGroup>

                        <div className="col-12 col-md-3"> 
                          <Button variant="primary" onClick={this.submitRegistration}>Εγγραφή</Button>
                        </div>
                      </div>
                    )}

                    <span className="p-2 col-12"></span>

                    <p className="col-12">Χρειαζόμαστε να έχουμε έναν "μπούσουλα" για το πόσα άτομα θέλουν να μετέχουν στην εκδήλωση αυτή, οπότε θα χρειαστεί να ζητήσουμε το email σου για την εγγραφή σου σε αυτό. Μην ανησυχείς, συλλέγουμε μόνο το ακαδημαϊκό σου email, χωρίς το όνομά σου. Τα στοιχεία σου θα αποθηκευτούν σε σέρβερ του po/iw εντός Ε.Ε. μέχρι την ημέρα της εκδήλωσης και θα χρησιμοποιηθούν μόνο για να σε ενημερώσουμε γι'αυτήν. Έπειτα από την εκδήλωση θα καταστρέψουμε όλα σου τα στοιχεία από την βάση δεδομένων μας. po/iw ❤️ privacy.</p>
                    <span className="p-4 col-12"></span>
                    <div className="col-12">
                      <h4>🤔 Οδηγίες συμμετοχής</h4>
                      <p>Θα χρειαστεί να συμπληρώσεις το email σου παραπάνω και να επιβεβαιώσεις την εγγραφή σου μέσω του link που θα σταλεί σε αυτό. Εξετάζουμε ακόμη ποια πλατφόρμα θα χρησιμοποιήσουμε για την εκδήλωση, παρ'όλα αυτά, έλεγχε συχνά το ακαδημαϊκό σου email γιατί θα σου στείλουμε οδηγίες εισόδου λίγες μέρες πρίν.</p>

                      <span className="p-4 col-12"></span>

                      <h4>📢 Όροι συμμετοχής &amp; Αποποίηση ευθύνης</h4>
                      <p>Το po/iw είναι μια νεοσύστατη ομάδα στο ΕΛΜΕΠΑ. Το παρόν event απευθύνεται μόνο για νεοεισαχθέντες φοιτητές στο τμήμα ΗΜΜΥ του ΕΛΜΕΠΑ (με ΑΜ thXXXX, όπου XXXX > 20100). Το po/iw δεν αντιπροσωπεύει καμία πολιτική παράταξη, ενώ τα ενδιαφέροντά της ως ομάδα απέχουν κατα πολύ από την πολιτική. Το Ελληνικό Μεσογειακό Πανεπιστήμιο δεν έχει ενημερωθεί για αυτή την εκδήλωση και δεν θα μετέχει κανένας νόμιμος εκπρόσωπος του. Το po/iw δεν φέρει καμία ευθύνη για οποιοδήποτε λάθος ή ασάφεια προκύψει στις πληροφορίες που θα δώσει κατά την διάρκεια αυτού του event.</p>    
                    </div>
              
                    </div>

                    <Logo></Logo>
                  </div>
                </div>
            </div>
        )
  }
}
  
export default Event;