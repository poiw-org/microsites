## po/iw cas
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nextjs-logo.svg/800px-Nextjs-logo.svg.png" width="200" /><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png" width="200" />
\
\
[![Powered by Vercel](https://raw.githubusercontent.com/poiw-org/cas/master/public/assets/powered-by-vercel.svg)](https://vercel.com/?utm_source=poiw-org&utm_campaign=oss)\
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=poiw-org_cas&metric=alert_status)](https://sonarcloud.io/dashboard?id=poiw-org_cas)


## Τι είναι;

Επειδή πολλές φορές, τα προγράμματα που κάνουμε απαιτούν κάποια είδους αυθεντικοποίηση, γράψαμε
μια υλοποίηση του πρωτοκόλλου CAS 2.0 (όχι ολόκληρου. Υλοποιούμε κατα καιρούς επιπλέον μέρη του πρωτόκολλου όταν το απαιτούν
τα πρότζεκτ μας) για δική μας διευκόλυνση. 

Με λίγα λόγια: Ένας λογαριασμός, ένα login UI, λιγότερος προγραμματισμός και χειρισμός διαπιστευτηρίων για τα project της ομάδας.

## CAS Specifications
Επειδή δεν θέλουμε να περιορίσουμε την χρήση του cas μόνο στα project μας, ενώ παράλληλα η χειροκίνητη επαλήθευση όλων των services είναι κουραστική και χρονοβόρα για εμάς, κάναμε το CAS να μην ελέγχει την εγκυρότητα του service URL. Αυτό όμως δεν σημαίνει ότι δεν χρειάζεται!

Endpoints:
```
--- CAS

/api/cas #Root CAS URL
/api/cas/serviceValidate #Χρησιμοποιείται από τις υπηρεσίες (sevices) στο τελευταίο βήμα του CAS flow για να επιβεβαιώσουν τον χρήστη και να αντλήσουν περισσότερες πληροφορίες (name, email, phone, school)

---HTTP API (Χρησιμοποιoύνται κυρίως από το UI.)

/api #Root API URL
/api/login #Παίρνει υποχρεωτικά το email και μετά είτε κωδικό πρόσβασης είτε κάποιο άλλο OAuth credential.
/api/register #Εγγραφή χρήστη στο CAS
/api/emailExists #Επιστρέφει αν το email υπάρχει στη βάση δεδομένων του po/iw, μαζί με εναλλακτικές μεθόδους πιστοποίησης.
/api/activateAccount #Χρησιμοποιείται για την ενεργοποίηση των λογαριασμών έπειτα απο εγγραφή νέου χρήστη.
```

## Πως το τρέχω;

Το project είναι γραμμένο σε Next.js (React Framework) και συνδέεται σε MongoDB με ενα environment variable MONGODB_URL.
Αφού κάνεις git clone και αφού αποκτήσεις πρόσβαση σε κάποια db (δική σου ή της ομάδας), τρέξε:
```
yarn install #για να εγκαταστήσεις τα dependancies.
yarn dev #για να τρέξεις το πρόγραμμα σε development mode
```
