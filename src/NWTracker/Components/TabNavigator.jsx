import "./TabNavigator.css"; // Importing the CSS file for styling

const TabNavigator = ({ activeTab, setActiveTab, tabs, children }) => {
  return (
    <div className="tab-container ">
      <div className="tabs">
        {tabs?.map((tab, index) => (
          <div
            key={index}
            className={`tab ${activeTab === index ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </div>
        ))}
      </div>
      <div
        className="tab-content"
        style={{ maxHeight: "79vh", overflowY: "auto" }}
      >
        {children}
      </div>
    </div>
  );
};

export default TabNavigator;
