import '@testing-library/jest-dom/extend-expect';

const editableFn = (_value) => ({
    get: () => _value,
    set: (v) => (_value = v)
});

Object.defineProperty(navigator, 'languages', editableFn(['en-US', 'en']));
