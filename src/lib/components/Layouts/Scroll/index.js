// import "./index.scss";
import EsportView from "./-molecules/Esport/index.js";
import EuropeanView from "./-molecules/European/index.js";

const ScrollComponent = ({ children, view, fullHeight, isHorizontal }) => {
    const Component =
        {
            european: EuropeanView,
            esport: EsportView,
            // asian: AsianView,
            // esport: EsportView,
            // Add other components as needed
        }[view] || EuropeanView;

    return <Component children={children} fullHeight={fullHeight} view={view} isHorizontal={isHorizontal} />;
};

export default ScrollComponent;
