// src/state/reducers/sampleReducer.js

const initialState = {
  count: 0,
};

export default function sampleReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
}
