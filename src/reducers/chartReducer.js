const defaultState = {
  notes : []
};

export const chartReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'NOTE_CHANGE':
    //console.log(action)
    return {
      ...state,
      notes : [...action.payload]
    }

    case 'SET_SONG_AS_PROP':
    console.log(action)
    return {
      ...state,
      song : action.payload
    }

  default:
    return state;
  }
};

export default chartReducer;
