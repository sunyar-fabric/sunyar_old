const { createContext } = require('react');

const MainContext = createContext({
    loadingDialog: false,
    setLoadingDialog: () => { },
    info: {},
    setInfo: () => { },
    handleGetInfo: () => { }
});

export default MainContext;
