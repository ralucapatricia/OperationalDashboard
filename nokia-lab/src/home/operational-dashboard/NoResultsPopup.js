import './NoResultsPopup.css';

const NoResultsPopup = ({children}) => {
  
    return (
        <div className="overlay">
            <div className="modal">
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'red' }}>No results found!</p>
              {children}</div>
        </div>
    );
};

export default NoResultsPopup;