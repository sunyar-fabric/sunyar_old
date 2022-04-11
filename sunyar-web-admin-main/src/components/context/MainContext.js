const { createContext } = require('react');

const MainContext = createContext({
    loadingDialog: false,
    setLoadingDialog: () => { },
    info: {},
    setInfo: () => { },
    handleGetInfo: () => { },
    profile: [],
    setProfile: () => { },
});

export default MainContext;
