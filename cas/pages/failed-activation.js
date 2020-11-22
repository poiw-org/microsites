import Logo from '../components/logo'

function failure() {
    return (
        <div className="container login">
            <h3>🤕 Κάτι πήγε στραβά.</h3>
            <p>Ο σύνδεσμος αυτός έχει ήδη χρησιμοποιηθεί ή δεν αντιστοιχεί σε κάποιο χρήστη.</p>
            <p><accent>Hint:</accent><br/><br/>Μερικές φορές υπηρεσίες email όπως Gmail, Yahoo κτλ, "μπαίνουν" στα συνημένα URLs για να σκανάρουν για malware και έτσι τα ενεργοποιούν. Μπορεί δηλαδή ο λογαριασμός σου να έχει ήδη ενεργός!</p>
            <Logo></Logo>
        </div>
        
    )
}
  
  export default failure

  