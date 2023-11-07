import "./Modal.css";

export function Modal({ isOpen, onClose, info }: { isOpen: boolean; onClose: () => void; info: string[][] | undefined; }) {
    return isOpen ? (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>
                    &times; {/* "X" button to close the modal */}
                </span>
                <h3> 🔠 Letters </h3>
                <p>{info ? info[0].join(",") : "No Data"}</p>

                <h3> 📰 NYT Solution </h3>
                <p>
                    {info
                        ? info[1] && info[1][0] && info[1][1]
                            ? info[1][0] + " -> " + info[1][1]
                            : "No NYT solutions for this letter set"
                        : "No NYT solutions for this letter set"}
                </p>

                <h3> 🧮 Calculated Solution List: </h3>
                <p>
                    {info
                        ? info[2]
                            ? info[2].map((item) => (
                                <p>{item[0] + " -> " +item[1]}</p>
                            )
                            )
                            : "No solutions found"
                        : "No solutions found"}
                </p>
            </div>
        </div>
    ) : null;
}
