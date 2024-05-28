import './NoResultsPopup.css';

const NoResultsPopup = ({children, message}) => {
  
    return (
        <div className="overlay">
            <div className="modal-styles">
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'red' }}>{message}</p>
              {children}</div>
        </div>
    );
};

export default NoResultsPopup;