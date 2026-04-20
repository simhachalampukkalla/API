import { memo } from 'react';

const PopUp = ({isOpen , onClose}) => {

    if(!isOpen) return null;
  return (
   <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2>Alert</h2>
        <p style = {styles.txt}>This is a simple popup in React</p>
        <button onClick={onClose} style={styles.alrtbutton}>
          Close
        </button>
      </div>
    </div>

  );
};


const imagePopUp = {
  overlay: {
    position: "fixed",
  }
};


const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    // backgroundColor: "rgba(237, 211, 211, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    textAlign: "center",
  },

  txt: {
    color : "#2a2212",
    "font-size": "medium"
  },

  alrtbutton : {
    backgroundColor: "rgba(127, 55, 242, 0.5)",
    color: "white",
    border: "none",
    marginTop: "10px",
    borderRadius: "4px",
    padding: "10px 20px",
    cursor: "pointer",
  }
};

export default memo(PopUp);