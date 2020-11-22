export default function Logo(){
    return(
        <div className="logo row">
            <h1 className="col-12">po/iw <accent>cas</accent></h1>
            <p className="col-12">Αναπτύχθηκε και υλοποιήθηκε από το po/iw με τη χρήση ελεύθερου λογισμικού.</p>
            <span className="col-12 p-3">
                <p>Ο σέρβερ του po/iw CAS είναι μια ευγενική χορηγία του Vercel:</p>
                <a href="https://vercel.com/?utm_source=poiw-org&utm_campaign=oss" target="_blank">
                    <img src="../assets/powered-by-vercel.svg" />
                </a>
            </span>
        </div>

    )
}