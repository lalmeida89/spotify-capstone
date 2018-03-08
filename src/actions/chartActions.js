export const noteChange = (notes) => {
  return dispatch => {

    dispatch({
      type: 'NOTE_CHANGE',
      payload: notes
    })
  }
}

export const setSongAsProp = (song) => {
  return dispatch => {

    dispatch({
      type: 'SET_SONG_AS_PROP',
      payload: song
    })
  }
}
